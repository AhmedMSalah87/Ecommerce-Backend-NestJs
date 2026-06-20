import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  ValidateIf,
} from 'class-validator';
import { IsMatched } from '../../../common/validators/isMatched/isMatched.decorator';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  name: string;

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
}
