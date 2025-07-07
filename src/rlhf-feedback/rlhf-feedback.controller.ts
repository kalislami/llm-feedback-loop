import { Body, Controller, Get, Post } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { RlhfFeedbackService } from './rlhf-feedback.service';
import { CreateRLHFFeedbackDto } from './create-rlhf-feedback.dto';

@Controller('rlhf-feedback')
export class RlhfFeedbackController {
    constructor(private readonly service: RlhfFeedbackService) { }

    @Post()
    async create(@Body() dto: CreateRLHFFeedbackDto) {
        return await this.service.create(dto);
    }

    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @Get('export')
    async exportJsonl() {
        const all = await this.service.findAll();
        const lines = [];

        for (const { prompt, responses, bestIndex, ranking } of all) {
            if (
                prompt &&
                Array.isArray(responses) &&
                responses.length >= 2
            ) {
                try {
                    // === Case 1: bestIndex (saat responses = 2)
                    if (typeof bestIndex === 'number' && responses.length === 2) {
                        const chosen = responses[bestIndex]?.text;
                        const rejected = responses.find((_, i) => i !== bestIndex)?.text;

                        lines.push(
                            JSON.stringify({
                                prompt: prompt.trim(),
                                chosen: chosen?.trim() ?? '',
                                rejected: rejected?.trim() ?? '',
                            }),
                        );
                        
                    // === Case 2: ranking (saat responses >= 2)
                    } else if (
                        Array.isArray(ranking) &&
                        ranking.length === responses.length
                    ) {
                        for (let i = 0; i < ranking.length; i++) {
                            const chosenIdx = ranking[i];
                            for (let j = i + 1; j < ranking.length; j++) {
                                const rejectedIdx = ranking[j];
                                const chosen = responses[chosenIdx]?.text;
                                const rejected = responses[rejectedIdx]?.text;

                                if (chosen && rejected) {
                                    lines.push(
                                        JSON.stringify({
                                            prompt: prompt.trim(),
                                            chosen: chosen.trim(),
                                            rejected: rejected.trim(),
                                        }),
                                    );
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log('error export in loop: ', e);
                    continue;
                }
            }
        }

        const outputPath = path.join(process.cwd(), 'machine_learning/data/dpo-data.jsonl');
        fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');

        return {
            message: `Exported ${lines.length} feedbacks to rlhf-dpo-dataset.jsonl`,
            file: outputPath,
        };
    }
}