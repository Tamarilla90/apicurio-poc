import { Attributes } from '@google-cloud/pubsub';

export type Metadata<M extends Record<string, unknown> = Attributes> = {
  applicationMode?: string;
  origin?: string;
  correlationId?: string;
} & M;

export interface EventMessage<
  P extends Record<string, unknown> = Record<string, unknown>,
  M extends Record<string, unknown> = Attributes,
> {
  payload: P;
  metadata?: Metadata<M>;
}

export type ReceivedEventMessage<
  P extends Record<string, unknown> = Record<string, unknown>,
  M extends Record<string, unknown> = Attributes,
> = EventMessage<P, M> & {
  id: string;
  publishTime: string;
};
