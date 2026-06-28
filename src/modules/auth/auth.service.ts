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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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
    const accessToken = await this.jwtService.signAsync(
      {
        id: user._id,
      },
      { secret: process.env.ACCESS_SECRET_KEY, expiresIn: '15m' },
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: user._id },
      { secret: process.env.REFRESH_SECRET_KEY, expiresIn: '7d' },
    );
    return { message: 'Sign-in successful', accessToken, refreshToken };
  }
}
