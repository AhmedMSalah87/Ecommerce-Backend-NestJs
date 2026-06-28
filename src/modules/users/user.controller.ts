import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { Request } from 'express';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/role.guard';

@UseGuards(RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Roles(['customer'])
  getUser(@Req() req: Request) {
    // return this.userService.getUser();
    return req.user._id;
  }

  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return id;
  }

  @Get()
  @Roles(['admin'])
  getUsers() {
    return 'all users';
  }
}
