import {
  Body,
  Controller,
  Delete,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/role.guard';
import { AddCategoryDto } from './dto/addCategory.dto';
import { CategoryService } from './category.service';
import { ParseObjectIdPipe } from '../../common/pipes/objectId.pipe';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/utils/multerOptions.utils';
import { imageValidator } from '../../infrastructure/storage/validators/image.validator';

// order of decorator here has no effect in this scenario
//as guards dont work unless request is coming so it will read metadata from roles any way
@UseGuards(RolesGuard)
@Roles(['admin'])
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseInterceptors(FileInterceptor('attachment', multerOptions))
  @Post()
  async addCategory(
    @Body() data: AddCategoryDto,
    @UploadedFile(new ParseFilePipe({ validators: imageValidator }))
    image: Express.Multer.File,
  ) {
    return await this.categoryService.addCategory(data, image);
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return await this.categoryService.deleteCategory(id);
  }
}
