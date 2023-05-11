import { Message, PubSub, Subscription, Topic } from '@google-cloud/pubsub';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
} from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import {
  GOOGLE_PUB_SUB_SERVER_OPTIONS,
  GooglePubSubOptions,
} from './google-pub-sub-options';

type MessageHandler = (message: Message) => Promise<void>;

@Injectable()
export class GooglePubSubStrategy
  extends Server
  implements CustomTransportStrategy, OnApplicationShutdown
{
  public readonly logger = new Logger(GooglePubSubStrategy.name);
  private readonly subscriptions: { [eventName: string]: Subscription } = {};
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

  async listen(callback: () => void) {
    this.client = new PubSub({
      credentials: this.options.configuration.credentials,
      projectId: this.options.configuration.projectId,
    });

    const registeredEventNames = [...this.messageHandlers.keys()];
    const pendingSubscriptions = registeredEventNames.map((eventName) =>
      this.subscribe(eventName).catch((error) => {
        this.logger.error({
          message: 'Error when subscribing to event',
          payload: {
            eventName,
            errorMessage: error.message,
          },
        });
        this.handleError(error);
      }),
    );

    Promise.all(pendingSubscriptions).then(() => callback());
  }

  async close() {
    this.logger.debug('Closing client');

    await Promise.all(
      Object.values(this.subscriptions).map(async (subscription) => {
        return await subscription.close();
      }),
    ).catch((error) => this.handleError(error));

    this.logger.log('Client closed successfully!');
  }

  private async subscribe(eventName: string): Promise<void> {
    const subscription = await this.getSubscription(eventName);
    const messageHandler = this.getMessageHandler(eventName);

    subscription.on('message', messageHandler.bind(this));
    subscription.on('error', (error) => {
      this.handleError(error);
    });

    this.subscriptions[eventName] = subscription;
  }

  private getMessageHandler(eventName: string): MessageHandler {
    return async (pubSubMessage: Message) => {
      const handler = this.getHandlerByPattern(eventName);

      this.logger.debug({
        message: 'Received message to be processed',
        payload: {
          id: pubSubMessage.id,
          eventName,
        },
      });

      let jsonParse = {};
      try {
        jsonParse = JSON.parse(pubSubMessage.data.toString());
      } catch (e) {
        this.logger.error('Message bad formatter');
        pubSubMessage.ack();
      }

      const receivedEventMessage = {
        id: pubSubMessage.id,
        payload: jsonParse,
        publishTime: pubSubMessage.publishTime.toISOString(),
      };

      const result = await handler(receivedEventMessage);
      result.subscribe({
        next: () => {
          this.logger.debug({
            message: 'Message processed successfully',
            payload: {
              id: pubSubMessage.id,
              eventName,
            },
          });
          pubSubMessage.ack();
        },
        error: (error: Error) => {
          this.logger.error({
            message: 'Error processing the event message',
            payload: {
              id: pubSubMessage.id,
              eventName,
              errorMessage: error.message,
            },
          });
        },
      });
    };
  }

  private async getSubscription(eventName: string): Promise<Subscription> {
    const topic = this.getTopic(eventName);
    const subscriptionName = this.getSubscriptionName(eventName);

    let subscription = topic.subscription(subscriptionName);

    this.logger.debug({
      message: 'Getting Subscription',
      payload: {
        eventName,
        subscriptionName,
      },
    });

    [subscription] = await subscription.get();

    return subscription;
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

  private getSubscriptionName(eventName: string): string {
    return `${eventName}-sub`;
  }
}
