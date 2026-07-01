import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateUserDto } from '../users/dto/createUser.dto';
import { SignInDto } from '../users/dto/signIn.dto';
import { compareValue, hashValue } from '../../common/utils/hash.utils';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../db/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(data: CreateUserDto) {
    const { firstName, lastName, email, password } = data;
    const emailExist = await this.userRepo.findUserByEmail(email);
    if (emailExist) {
      throw new ConflictException('email already exist');
    }
    await this.userRepo.create({
      firstName,
      lastName,
      email,
      password: await hashValue(password),
    });
    return { message: 'Sign-up successful' };
  }

  async signIn(data: SignInDto) {
    const { email, password } = data;
    const user = await this.userRepo.findUserByEmail(email);
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
