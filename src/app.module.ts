import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackModule } from './feedback/feedback.module';
import { RlhfFeedbackModule } from './rlhf-feedback/rlhf-feedback.module';

@Module({
  imports: [
    ChatModule,
    FeedbackModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    RlhfFeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
