export const GOOGLE_PUB_SUB_SERVER_OPTIONS = 'PUB_SUB_SERVER_OPTIONS';

export interface GooglePubSubOptions {
  configuration: {
    credentials: Record<string, unknown>;
    projectId: string;
  };
}
