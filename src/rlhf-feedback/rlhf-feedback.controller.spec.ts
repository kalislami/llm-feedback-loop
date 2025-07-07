import { Test, TestingModule } from '@nestjs/testing';
import { RlhfFeedbackController } from './rlhf-feedback.controller';

describe('RlhfFeedbackController', () => {
  let controller: RlhfFeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RlhfFeedbackController],
    }).compile();

    controller = module.get<RlhfFeedbackController>(RlhfFeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
