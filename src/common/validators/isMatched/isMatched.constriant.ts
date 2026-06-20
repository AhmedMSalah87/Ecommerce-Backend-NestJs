import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'matchPassword', async: false })
export class MatchTwoProperties implements ValidatorConstraintInterface {
  validate(
    value: string,
    args: ValidationArguments,
  ): Promise<boolean> | boolean {
    console.log({ value, args });
    const [propertyToMatch] = args.constraints as [string];
    return value === args.object[propertyToMatch];
  }

  defaultMessage(args: ValidationArguments): string {
    const [propertyToMatch] = args.constraints as [string];
    return `${args.property} dont match with ${propertyToMatch}`;
  }
}
