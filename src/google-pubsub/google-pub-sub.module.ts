import { Module } from '@nestjs/common';
import { GooglePubSubStrategy } from './google-pub-sub-strategy';
import {
  GOOGLE_PUB_SUB_SERVER_OPTIONS,
  GooglePubSubOptions,
} from './google-pub-sub-options';
import {
  GooglePubSubClient,
  PUB_SUB_CLIENT,
} from './google-pub-sub-client-proxy';

const pubSubClient = {
  provide: PUB_SUB_CLIENT,
  useClass: GooglePubSubClient,
};

@Module({
  providers: [
    GooglePubSubStrategy,
    pubSubClient,
    {
      provide: GOOGLE_PUB_SUB_SERVER_OPTIONS,
      useFactory: () => {
        const options: GooglePubSubOptions = {
          configuration: {
            projectId: 'sandboxcw',
            credentials: process.env.GCP_CREDENTIALS
              ? JSON.parse(process.env.GCP_CREDENTIALS)
              : {},
          },
        };

        return options;
      },
    },
  ],
  exports: [GooglePubSubStrategy, pubSubClient],
})
export class GooglePubSubModule {}
