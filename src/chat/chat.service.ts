import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ChatService {
  private readonly openRouterApiKey = process.env.OPENROUTER_API_KEY;

  async sendMessageFromLocalModel(prompt: string): Promise<string> {
    const res = await axios.post('http://localhost:5005/generate', {
      prompt
    });

    return res.data.response;
  }

  async sendMessageFromOpenRouter(prompt: string, n: number): Promise<string[]> {
    const requests = Array.from({ length: n }).map(() =>
      axios
        .post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'rekaai/reka-flash-3:free',
            messages: [
              {
                role: 'system',
                content:
                  'You are an expert assistant that reasons step-by-step before answering.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${this.openRouterApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        )
        .then((res) => {
          const content = res.data.choices?.[0]?.message?.content ?? '';
          return content.replace(/<reasoning>[\s\S]*?<\/reasoning>/, '').trim();
        })
        .catch((err) => {
          console.error('Request failed:', err.message);
          return null;
        }),
    );

    const results = await Promise.allSettled(requests);
    return results
      .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled' && !!r.value)
      .map((r) => r.value);
  }
}
