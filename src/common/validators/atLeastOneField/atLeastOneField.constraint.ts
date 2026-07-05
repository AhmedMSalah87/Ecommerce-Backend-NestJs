import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOneField', async: false })
export class AtLeastOneFieldConstraint implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): boolean {
    const fields = args?.constraints as string[];
    console.log(args);
    return fields.some((field) => args?.object[field]);
  }
  defaultMessage(): string {
    return 'At least one field must be provided';
  }
}
