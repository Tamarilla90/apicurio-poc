import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { from, mergeMap, of } from 'rxjs';
import { ApicurioClientService } from '../apicurio-client/apicurio-client.service';
import Ajv from 'ajv';
import formatsPlugin from 'ajv-formats';

@Controller('consumer')
export class ConsumerController {
  constructor(private readonly apiCurioClient: ApicurioClientService) {}

  @MessagePattern('CE_POC_TOPIC')
  consumerEvent(@Payload() message) {
    return from(this.apiCurioClient.getContentByGlobalId(5)).pipe(
      mergeMap((result) => {
        const ajv = new Ajv();
        formatsPlugin(ajv);
        const validate = ajv.compile(result.data);
        const valid = validate(message.payload);
        if (!valid) {
          console.log(validate.errors);
        } else {
          console.log('valid');
        }

        return of({});
      }),
    );
  }
}
