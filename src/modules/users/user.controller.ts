import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getUser(@Req() req: Request) {
    // return this.userService.getUser();
    return req.user._id;
  }

  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return id;
  }
}
