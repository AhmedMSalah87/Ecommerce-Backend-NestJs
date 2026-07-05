import { registerDecorator, ValidationOptions } from 'class-validator';
import { AtLeastOneFieldConstraint } from './atLeastOneField.constraint';

export const AtLeastOneField = (
  fields: string[],
  options?: ValidationOptions,
): ClassDecorator => {
  return function (target) {
    registerDecorator({
      propertyName: '',
      target,
      constraints: fields,
      options,
      validator: AtLeastOneFieldConstraint,
    });
  };
};
