import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GooglePubSubModule } from './google-pubsub';
import { ConsumerController } from './consumer/consumer.controller';
import { ProducerController } from './producer/producer.controller';
import { ConfigModule } from '@nestjs/config';
import { ApicurioClientModule } from './apicurio-client/apicurio-client.module';
import { AjvModule } from './ajv/ajv.module';
import { HttpModule } from '@nestjs/axios';
import { ValidationMessage } from './validation-message/validation-message';

@Module({
  imports: [
    GooglePubSubModule,
    ConfigModule.forRoot(),
    ApicurioClientModule,
    AjvModule,
    HttpModule,
  ],
  controllers: [AppController, ConsumerController, ProducerController],
  providers: [AppService, ValidationMessage],
})
export class AppModule {}
