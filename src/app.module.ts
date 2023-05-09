import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GooglePubSubModule } from './google-pubsub';
import { ConsumerController } from './consumer/consumer.controller';
import { ProducerController } from './producer/producer.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [GooglePubSubModule, ConfigModule.forRoot()],
  controllers: [AppController, ConsumerController, ProducerController],
  providers: [AppService],
})
export class AppModule {}
