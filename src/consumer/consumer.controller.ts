import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ValidationMessage } from '../validation-message/validation-message';

@Controller('consumer')
export class ConsumerController {
  constructor(private readonly validationMessage: ValidationMessage) {}

  @MessagePattern('CE_POC_TOPIC')
  consumerEvent(@Payload() message) {
    return this.validationMessage.validate(message);
  }
}
