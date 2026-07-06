import {
  Body,
  Controller,
  Delete,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/role.guard';
import { ParseObjectIdPipe } from '../../common/pipes/objectId.pipe';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/utils/multerOptions.utils';
import { imageValidator } from '../../infrastructure/storage/validators/image.validator';
import { BrandService } from './brand.service';
import { AddBrandDto } from './dto/addBrand.dto';
import { UpdateBrandDto } from './dto/updateBrand.dto';

// order of decorator here has no effect in this scenario
//as guards dont work unless request is coming so it will read metadata from roles any way
@UseGuards(RolesGuard)
@Roles(['admin'])
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @UseInterceptors(FileInterceptor('attachment', multerOptions))
  @Post()
  async addBrand(
    @Body() data: AddBrandDto,
    @UploadedFile(new ParseFilePipe({ validators: imageValidator }))
    image: Express.Multer.File,
  ) {
    return await this.brandService.addBrand(data, image);
  }

  @UseInterceptors(FileInterceptor('attachment', multerOptions))
  @Patch(':id')
  async updateBrand(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() data: UpdateBrandDto,
    @UploadedFile(
      new ParseFilePipe({ validators: imageValidator, fileIsRequired: false }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.brandService.updateBrand(id, data, file);
  }

  @Delete(':id')
  async deleteBrand(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return await this.brandService.deleteBrand(id);
  }
}
