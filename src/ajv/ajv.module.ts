import { Module } from '@nestjs/common';
import Ajv from 'ajv';
import formatsPlugin from 'ajv-formats';

export const AJV = 'AJV';

@Module({
  providers: [
    {
      provide: AJV,
      useFactory: () => {
        const ajv = new Ajv();
        formatsPlugin(ajv);
        return ajv;
      },
    },
  ],
  exports: [AJV],
})
export class AjvModule {}
