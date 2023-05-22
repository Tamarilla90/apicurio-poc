import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PUB_SUB_CLIENT } from '../google-pubsub/google-pub-sub-client-proxy';
import { ClientProxy } from '@nestjs/microservices';
import { ValidationMessage } from '../validation-message/validation-message';
import { mergeMap, of } from 'rxjs';

@Controller('v1/producer')
export class ProducerController {
  constructor(
    @Inject(PUB_SUB_CLIENT) private readonly clientProxy: ClientProxy,
    private readonly validationMessage: ValidationMessage,
  ) {}

  @Post('/valid_message')
  sendMessageValidToPubsub(@Body() message: Record<string, any>) {
    return this.validationMessage.validate(message).pipe(
      mergeMap(() => this.clientProxy.emit('CE_POC_TOPIC', message)),
      mergeMap(() => of({})),
    );
  }

  @Post('/not_valid_message')
  sendMessageNotValidToPubsub(@Body() message: Record<string, any>) {
    return this.clientProxy.emit('CE_POC_TOPIC', message);
  }
}
