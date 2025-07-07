import { Controller, Post, Body, Get } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }

  @Post()
  async submitFeedback(
    @Body()
    body: {
      prompt: string;
      response: string;
      rating: 'up' | 'down';
      model: string;
    },
  ) {
    const result = await this.feedbackService.createFeedback(body);
    return { message: 'Feedback saved', id: result._id };
  }

  @Get()
  async getAll() {
    return this.feedbackService.findAll();
  }

  @Get('export')
  async exportJsonl() {
    const feedbacks = await this.feedbackService.findAllUpvoted();

    const lines = feedbacks.map((fb) =>
      JSON.stringify({
        prompt: fb.prompt,
        completion: fb.response,
      }),
    );

    const outputPath = path.join(process.cwd(), 'machine_learning/data/sft-data.jsonl');
    fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');

    return {
      message: `Exported ${feedbacks.length} feedbacks to fine-tune-data.jsonl`,
      file: outputPath,
    };
  }
}
