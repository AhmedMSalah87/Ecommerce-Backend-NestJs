import { registerDecorator, ValidationOptions } from 'class-validator';
import { MatchTwoProperties } from './isMatched.constriant';

export function IsMatched(
  constraint: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (target, propertyName) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      constraints: [constraint],
      validator: MatchTwoProperties,
    });
  };
}
