import argparse
import os
from dotenv import load_dotenv
from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    TrainingArguments,
    Trainer,
)
from trl import DPOTrainer, DPOConfig  # pastikan `trl` terinstall

load_dotenv()

# Argument CLI
parser = argparse.ArgumentParser()
parser.add_argument('--mode', choices=['sft', 'dpo'], required=True)
args = parser.parse_args()

BASE_MODEL = os.getenv("BASE_MODEL")
CHECKPOINT_MODEL = os.getenv("CHECKPOINT_MODEL")
CHECKPOINT_DIR = "./sft-checkpoints"

if args.mode == "sft":
    # ======================== SFT ========================
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    model = AutoModelForCausalLM.from_pretrained(BASE_MODEL)

    dataset = load_dataset("json", data_files="./data/sft-data.jsonl")

    def preprocess(example):
        prompt = f"### User:\n{example['prompt']}\n### Assistant:\n{example['completion']}"
        tokenized = tokenizer(prompt, truncation=True, padding="max_length", max_length=512)
        tokenized['labels'] = tokenized['input_ids']
        return tokenized

    tokenized_dataset = dataset['train'].map(preprocess)

    training_args = TrainingArguments(
        output_dir=CHECKPOINT_DIR,
        per_device_train_batch_size=2,
        num_train_epochs=3,
        logging_steps=10,
        save_steps=100,
        fp16=False,
        report_to="none",
        save_safetensors=False,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
    )

    print("🚀 Starting Supervised Fine-Tuning...")
    trainer.train()

elif args.mode == "dpo":
    # ======================== DPO ========================
    from datasets import load_dataset
    from transformers import AutoModelForCausalLM, AutoTokenizer
    from trl import DPOTrainer, DPOConfig

    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)

    dataset = load_dataset("json", data_files="./data/dpo-data.jsonl")

    def preprocess_dpo(example):
        return {
            "prompt": f"### User:\n{example['prompt']}\n### Assistant:\n",
            "chosen": example["chosen"],
            "rejected": example["rejected"],
        }

    dpo_dataset = dataset["train"].map(preprocess_dpo)

    # Gunakan model hasil SFT sebagai base untuk DPO
    model = AutoModelForCausalLM.from_pretrained(CHECKPOINT_MODEL)
    ref_model = AutoModelForCausalLM.from_pretrained(BASE_MODEL)

    dpo_config = DPOConfig(
        output_dir="./dpo-checkpoints",
        per_device_train_batch_size=2,
        num_train_epochs=3,
        logging_steps=10,
        save_steps=100,
        report_to="none",
        bf16=False,
        fp16=False,
    )

    trainer = DPOTrainer(
        model=model,
        ref_model=ref_model,
        args=dpo_config,
        train_dataset=dpo_dataset
    )

    print("🔥 Starting DPO Training...")
    trainer.train()