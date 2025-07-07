import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RlhfFeedbackController } from './rlhf-feedback.controller';
import { RlhfFeedbackService } from './rlhf-feedback.service';
import { RLHFFeedback, RLHFFeedbackSchema } from './rlhf-feedback.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RLHFFeedback.name, schema: RLHFFeedbackSchema },
    ]),
  ],
  controllers: [RlhfFeedbackController],
  providers: [RlhfFeedbackService],
  exports: [RlhfFeedbackService],
})
export class RlhfFeedbackModule {}