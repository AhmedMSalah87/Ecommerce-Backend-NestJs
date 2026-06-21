import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from '../users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { SignInDto } from '../users/dto/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: CreateUserDto) {
    return await this.authService.signUp(body);
  }

  @Post('signin')
  async signIn(@Body() body: SignInDto) {
    return await this.authService.signIn(body);
  }
}
