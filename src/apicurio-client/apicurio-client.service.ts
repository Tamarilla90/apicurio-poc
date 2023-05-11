import { ArtifactsApi, Configuration } from 'apicurio-registry-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApicurioClientService extends ArtifactsApi {
  constructor() {
    super({
      basePath: 'http://localhost:8080/apis/registry/v2',
    } as Configuration);
  }
}
