import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RLHFFeedback extends Document {
  @Prop({ required: true })
  prompt: string;

  @Prop({
    type: [{ text: String, id: String }],
    required: true,
    description: 'List of model responses shown to the user',
  })
  responses: { text: string; id: string }[];

  @Prop({
    type: [Number],
    required: false,
    description: 'Optional ranking from user, e.g. [1, 0] means first is better',
  })
  ranking?: number[];

  @Prop({
    type: Number,
    required: false,
    description: 'Index of best response if not using full ranking',
  })
  bestIndex?: number;

  @Prop({
    type: String,
    required: false,
    description: 'Optional free-text feedback from user',
  })
  comment?: string;
}

export const RLHFFeedbackSchema = SchemaFactory.createForClass(RLHFFeedback);

// {
//   "prompt": "Jelaskan apa itu Kubernetes.",
//   "responses": [
//     { "id": "1", "text": "Kubernetes adalah sistem orkestrasi kontainer." },
//     { "id": "2", "text": "Kubernetes digunakan untuk mengelola container dan deployment." }
//   ],
//   "ranking": [1, 0], 
//   "comment": "Jawaban kedua lebih lengkap."
// }

// Atau kalau hanya ingin menyimpan bestIndex:
// {
//   "prompt": "Apa itu React?",
//   "responses": [
//     { "id": "1", "text": "React adalah library UI dari Facebook." },
//     { "id": "2", "text": "React digunakan untuk membuat antarmuka pengguna." }
//   ],
//   "bestIndex": 0
// }
