import { registerDecorator, ValidationOptions } from 'class-validator';
import { MatchTwoProperties } from './isMatched.constriant';

export function IsMatched(
  constraint: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [constraint],
      validator: MatchTwoProperties,
    });
  };
}
