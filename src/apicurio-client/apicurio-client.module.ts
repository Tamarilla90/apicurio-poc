import { Module } from '@nestjs/common';
import { ApicurioClientService } from './apicurio-client.service';

@Module({
  providers: [ApicurioClientService],
  exports: [ApicurioClientService],
})
export class ApicurioClientModule {}
