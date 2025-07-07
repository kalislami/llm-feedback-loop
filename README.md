# llm-feedback-loop

An end-to-end pipeline for fine-tuning open-source LLMs (e.g., TinyLLaMA) using Reinforcement Learning from Human Feedback (RLHF). This project covers feedback collection, dataset export, supervised fine-tuning (SFT), and preference optimization (DPO).

---

## Features

- ✅ Human feedback API using **NestJS + MongoDB**
- ✅ Feedback export to **JSONL** format for fine-tuning
- ✅ Support for **Supervised Fine-Tuning (SFT)** and **Direct Preference Optimization (DPO)**
- ✅ Integration with HuggingFace `transformers`, `datasets`, and `trl`
- ✅ Model training via `python scripts/trainer.py --mode sft|dpo`
- ✅ Flexible for any model (e.g., TinyLLaMA, Mistral, LLaMA-2)

---

## Project Structure

```
llm-feedback-loop/
│
├── machine_learning/
│   ├── data/                     # Exported JSONL feedback data
│   ├── scripts/
│   │   └── trainer.py            # Unified trainer for SFT & DPO
│   │   └── inference_server.py   # Server model
│   └── sft/dpo-checkpoints/      # Output models from training
│
├── src/                         # NestJS source for feedback API
│   ├── chat/
│   ├── feedback/
│   ├── rlhf-feedback/
│   ├── app.module.ts
│   └── main.ts
│
├── .env                         # Environment variables
├── README.md
└── package.json
```

---

## 🛠️ Setup

### 1. Clone & install

```bash
git clone https://github.com/kalislami/llm-feedback-loop.git
cd llm-feedback-loop

# For backend API
npm install

# notes: create file from nest cli
nest g module name_file
nest g service name_file
nest g controller name_file
```

### 2. Run Feedback API

```bash
# Run NestJS backend
npm run start:dev
```

### 3. Prepare Feedback Dataset

Submit feedback to the API, then export it:

```http
POST /feedback
GET  /feedback/export
```

---

## Fine-Tune Your LLM

Make sure your `.env` contains:

```
BASE_MODEL=TinyLLaMA/TinyLLaMA-1.1B-Chat-v1.0
CHECKPOINT_DIR=./sft-checkpoints/
```

### Setup 
```bash
cd machine_learning
python -m venv .venv
.venv\Scripts\Activate.ps1 # powershell vscode
pip install -r requirements.txt

# exit .venv command: deactivate
```

### Supervised Fine-Tuning (SFT)

```bash
python scripts/trainer.py --mode sft
```

### Direct Preference Optimization (DPO)

```bash
python scripts/trainer.py --mode dpo
```

### Serve AI Model

```bash
python scripts/inference_server.py
```

---

## Sample Feedback Format

```json
{
  "prompt": "Apa itu Kubernetes?",
  "responses": [
    { "id": "1", "text": "Kubernetes adalah sistem orkestrasi kontainer." },
    { "id": "2", "text": "Kubernetes digunakan untuk mengelola container dan deployment." }
  ],
  "ranking": [1, 0],
  "comment": "Jawaban kedua lebih lengkap."
}
```

---

## Todo

- [ ] Add web UI for feedback collection
- [ ] Add support for PPO
- [ ] Add model evaluation metrics (BLEU, ROUGE, etc.)

---

## References

- [HuggingFace TRL](https://github.com/huggingface/trl)
- [TinyLLaMA](https://huggingface.co/TinyLLaMA)
- [RLHF Papers](https://huggingface.co/papers/RLHF)

---



| Metode RLHF | Tujuan                                     | Ketergantungan                       |
| ------ | ------------------------------------------ | ------------------------------------ |
| SFT (Supervised Fine-Tuning)    | Ajarkan jawaban berkualitas                | Dataset prompt + completion          |
| DPO (Direct Preference Optimization)    | Latih agar lebih sesuai preferensi manusia | Dataset prompt + responses + ranking |
| PPO (Proximal Policy Optimization)   | Sama seperti DPO, tapi lebih kompleks      | Butuh reward model & tuning ekstra   |


---

## License

MIT License. Feel free to use, fork, and contribute.