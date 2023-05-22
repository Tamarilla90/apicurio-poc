import { Inject, Injectable, Logger } from '@nestjs/common';
import { AJV } from '../ajv/ajv.module';
import Ajv from 'ajv';
import { HttpService } from '@nestjs/axios';
import { map, mergeMap, of, throwError } from 'rxjs';

@Injectable()
export class ValidationMessage {
  private readonly logger = new Logger(ValidationMessage.name);

  private urlCloudEvents =
    'http://localhost:8080/apis/registry/v2/groups/CloudEvents/artifacts/cwExtensionRequest.json';

  constructor(
    @Inject(AJV) private ajv: Ajv,
    private httpService: HttpService,
  ) {}

  validate(value: Record<string, any>) {
    const { payload } = value;
    return this.validateSchemaMessage(payload).pipe(
      mergeMap(() => this.validateSchemaData(payload)),
      map((payload) => {
        this.logger.log({
          message: 'Validations is success',
        });
        return payload;
      }),
    );
  }

  private validateSchemaMessage(payload) {
    return this.getSchema(this.urlCloudEvents).pipe(
      mergeMap((schema) => {
        return this.validateMessage(schema, payload);
      }),
    );
  }

  private validateSchemaData(payload: Record<string, any>) {
    const { dataschema, data } = payload;
    return this.getSchemaAndValidateData(dataschema, data);
  }

  private getSchemaAndValidateData(url: string, data: Record<string, any>) {
    return this.getSchema(url).pipe(
      mergeMap((schema) => {
        return this.validateMessage(schema, data);
      }),
    );
  }

  private getSchema(url: string) {
    return this.httpService.get(url).pipe(mergeMap((res) => of(res.data)));
  }

  private validateMessage(
    schema: Record<string, any>,
    payload: Record<string, any>,
  ) {
    const validate = this.ajv.compile(schema);
    const valid = validate(payload);
    if (valid) return of(payload);
    return throwError(() => validate.errors);
  }
}
