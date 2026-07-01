import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  ValidateIf,
} from 'class-validator';
import { IsMatched } from '../../../common/validators/isMatched/isMatched.decorator';
import { Role } from '../../../common/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ValidateIf((data: CreateUserDto) => {
    return Boolean(data.password);
  })
  @IsMatched('password')
  confirmPassword: string;

  @IsOptional()
  @IsEnum(Role, { message: 'role must be one of: customer, admin, staff' })
  role: Role = Role.CUSTOMER;
}
