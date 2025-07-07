import { Controller, Post, Body, HttpCode, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  @HttpCode(200)
  async chat(
    @Body('prompt') prompt: string,
    @Query('provider') provider?: string,
    @Query('count') count?: number,
  ) {
    const n = Math.min(Number(count) || 1, 3); // batas maks 3 response

    if (provider === 'local') {
      const result = await this.chatService.sendMessageFromLocalModel(prompt);
      return { response: result };
    }

    const results = await this.chatService.sendMessageFromOpenRouter(prompt, n);
    return { responses: results };
  }
}