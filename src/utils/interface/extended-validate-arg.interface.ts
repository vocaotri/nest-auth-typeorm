import { ValidationArguments } from 'class-validator';
import { REQUEST_CONTEXT } from '../interceptors/inject-user.interceptor';

export interface ExtendedValidationArguments extends ValidationArguments {
  object: {
    [REQUEST_CONTEXT]: {
      user: any;
    };
    pet: any;
    thumbnail: any;
    media: any;
  };
}
