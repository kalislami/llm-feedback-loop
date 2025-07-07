from transformers import AutoTokenizer, AutoModelForCausalLM
from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

base_model = os.getenv("BASE_MODEL")
tokenizer = AutoTokenizer.from_pretrained(base_model)
checkpoint_path = os.getenv("CHECKPOINT_PATH")
model = AutoModelForCausalLM.from_pretrained(checkpoint_path)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    user_input = data.get("prompt", "")
    max_tokens = data.get("max_tokens", 100)

    # Format prompt sesuai training
    prompt = f"### User:\n{user_input}\n### Assistant:\n"

    inputs = tokenizer(prompt, return_tensors="pt")

    outputs = model.generate(
        **inputs,
        max_new_tokens=max_tokens,
        temperature=0.8,       # agar lebih variatif
        top_p=0.95,            # nucleus sampling
        do_sample=True,        # sampling instead of greedy
        pad_token_id=tokenizer.eos_token_id
    )

    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Ambil hanya jawaban setelah prompt
    if generated_text.startswith(prompt):
        response = generated_text[len(prompt):].strip()
    else:
        response = generated_text.strip()

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(port=5005)
