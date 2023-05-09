import { ClientProxy, ReadPacket } from '@nestjs/microservices';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PubSub, Topic } from '@google-cloud/pubsub';
import {
  GOOGLE_PUB_SUB_SERVER_OPTIONS,
  GooglePubSubOptions,
} from './google-pub-sub-options';
import { EventMessage } from './event-message';

export const PUB_SUB_CLIENT = 'PubSubClient';

@Injectable()
export class GooglePubSubClient
  extends ClientProxy
  implements OnApplicationShutdown
{
  private readonly logger = new Logger(GooglePubSubClient.name);
  private client: PubSub;

  constructor(
    @Inject(GOOGLE_PUB_SUB_SERVER_OPTIONS)
    private readonly options: GooglePubSubOptions,
  ) {
    super();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.close();
  }

  async connect(): Promise<void> {
    if (this.client) {
      return;
    }

    this.logger.debug('Connecting');
    this.client = new PubSub({
      credentials: this.options.configuration.credentials,
      projectId: this.options.configuration.projectId,
    });
  }

  async close() {
    this.logger.debug('Closing');
    if (this.client) {
      await this.client.close();
    }
  }

  async dispatchEvent(packet: ReadPacket<EventMessage>): Promise<any> {
    try {
      this.logger.debug('Dispatching the event');

      const topic = this.getTopic(packet.pattern);

      const eventId = await topic.publishMessage({
        data: Buffer.from(JSON.stringify(packet.data.payload)),
      });

      this.logger.log({
        message: 'Event published successfully',
        payload: {
          eventId,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error({
          message: 'Error publishing event to PubSub',
          payload: {
            errorMessage: error.message,
          },
        });
      }
      throw error;
    }
  }

  protected publish(): any {
    throw new InternalServerErrorException(
      'Method intentionally not implemented.',
    );
  }

  private getTopic(eventName: string): Topic {
    const topicName = this.getTopicName(eventName);
    this.logger.debug({
      message: 'Getting topic',
      payload: {
        eventName,
        topicName,
      },
    });
    return this.client.topic(topicName);
  }

  private getTopicName(eventName: string): string {
    return `${eventName}`;
  }
}
