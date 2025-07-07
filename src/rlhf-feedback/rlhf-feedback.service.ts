import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RLHFFeedback } from './rlhf-feedback.schema';
import { Model } from 'mongoose';
import { CreateRLHFFeedbackDto } from './create-rlhf-feedback.dto';

@Injectable()
export class RlhfFeedbackService {
    constructor(
        @InjectModel(RLHFFeedback.name)
        private readonly model: Model<RLHFFeedback>,
    ) { }

    async create(dto: CreateRLHFFeedbackDto) {
        return await this.model.create(dto);
    }

    async findAll() {
        return this.model.find().exec();
    }
}