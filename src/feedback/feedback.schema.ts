import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  response: string;

  @Prop({ required: true, enum: ['up', 'down'] })
  rating: string;

  @Prop({ required: true })
  model: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);