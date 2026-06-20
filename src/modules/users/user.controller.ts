import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser() {
    return this.userService.getUser();
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return body;
  }

  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return id;
  }
}
