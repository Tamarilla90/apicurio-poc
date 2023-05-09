import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GooglePubSubStrategy } from './google-pubsub';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(
    {
      strategy: app.get(GooglePubSubStrategy),
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap().catch((error) => {
  console.error(`Unexpected error happened in the bootstrap: ${error.message}`);
  throw error;
});

process.on('unhandledRejection', (error: Error) => {
  throw error;
});

process.on('uncaughtException', (error: Error) => {
  console.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});
