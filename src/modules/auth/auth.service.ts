import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { SignInDto } from '../users/dto/signIn.dto';
import { compareValue } from '../../common/utils/hash.utils';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUp(data: CreateUserDto) {
    const emailExist = await this.userService.findUserByEmail(data.email);
    if (emailExist) {
      throw new ConflictException('email already exists');
    }
    await this.userService.createUser(data);
    return { message: 'Sign-up successful' };
  }

  async signIn(data: SignInDto) {
    const { email, password } = data;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const isMatched = await compareValue(password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException('invalid credentials');
    }
    return { message: 'Sign-in successful' };
  }
}
