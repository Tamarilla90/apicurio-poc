import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { of } from 'rxjs';

@Controller('consumer')
export class ConsumerController {
  @MessagePattern('CE_POC_TOPIC')
  consumerEvent(@Payload() message) {
    console.log(message);
    return of({});
  }
}
