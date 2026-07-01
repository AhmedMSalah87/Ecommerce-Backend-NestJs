import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from './user.service';
import type { Request } from 'express';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/utils/multerOptions.utils';

@UseGuards(RolesGuard)
@Roles(['customer'])
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

  @Get()
  @Roles(['admin'])
  getUsers() {
    return 'all users';
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('attachment', multerOptions))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return {
      fileName: file.originalname,
      type: file.mimetype,
      size: file.size,
    };
  }
}
