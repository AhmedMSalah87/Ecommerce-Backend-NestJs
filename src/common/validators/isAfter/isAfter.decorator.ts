import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsAfterConstriant } from './isAfter.constraint';

export const IsAfter = (
  property: string,
  options?: ValidationOptions,
): PropertyDecorator => {
  return function (target, propertyName) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName.toString(),
      options,
      constraints: [property],
      validator: IsAfterConstriant,
    });
  };
};
