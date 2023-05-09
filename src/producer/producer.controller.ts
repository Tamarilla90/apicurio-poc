import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PUB_SUB_CLIENT } from '../google-pubsub/google-pub-sub-client-proxy';
import { ClientProxy } from '@nestjs/microservices';

@Controller('v1/producer')
export class ProducerController {
  constructor(
    @Inject(PUB_SUB_CLIENT) private readonly clientProxy: ClientProxy,
  ) {}

  @Post()
  sendMessageToPubsub(@Body() message: Record<string, any>) {
    this.clientProxy.emit('CE_POC_TOPIC', message);
  }
}
