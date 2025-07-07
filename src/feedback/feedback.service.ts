import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackDocument } from './feedback.schema';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectModel(Feedback.name)
        private readonly feedbackModel: Model<FeedbackDocument>,
    ) { }

    async createFeedback(data: Partial<Feedback>): Promise<FeedbackDocument> {
        return this.feedbackModel.create(data);
    }

    async findAll(): Promise<Feedback[]> {
        return this.feedbackModel.find().sort({ createdAt: -1 }).exec();
    }

    async findAllUpvoted(): Promise<Feedback[]> {
        return this.feedbackModel.find({ rating: 'up' }).exec();
    }
}