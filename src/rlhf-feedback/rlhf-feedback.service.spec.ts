import { Test, TestingModule } from '@nestjs/testing';
import { RlhfFeedbackService } from './rlhf-feedback.service';

describe('RlhfFeedbackService', () => {
  let service: RlhfFeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RlhfFeedbackService],
    }).compile();

    service = module.get<RlhfFeedbackService>(RlhfFeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
