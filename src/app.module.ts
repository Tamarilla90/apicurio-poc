import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GooglePubSubModule } from './google-pubsub';
import { ConsumerController } from './consumer/consumer.controller';
import { ProducerController } from './producer/producer.controller';
import { ConfigModule } from '@nestjs/config';
import { ApicurioClientModule } from './apicurio-client/apicurio-client.module';

@Module({
  imports: [GooglePubSubModule, ConfigModule.forRoot(), ApicurioClientModule],
  controllers: [AppController, ConsumerController, ProducerController],
  providers: [AppService],
})
export class AppModule {}
