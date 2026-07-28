import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsAfter', async: false })
export class IsAfterConstriant implements ValidatorConstraintInterface {
  validate(value: Date, args: ValidationArguments): boolean {
    const [property] = args.constraints as string[];
    const dto = args.object;
    return value > dto[property];
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.constraints[0]} value not after ${args.value}`;
  }
}
