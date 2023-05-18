import { Test, TestingModule } from '@nestjs/testing';
import { ValidationMessage } from './validation-message';

describe('ValidationMessage', () => {
  let provider: ValidationMessage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationMessage],
    }).compile();

    provider = module.get<ValidationMessage>(ValidationMessage);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
