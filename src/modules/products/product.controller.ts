import {
  Body,
  Controller,
  ParseFilePipe,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/role.guard';
import { AddProductDto } from './dto/addProduct.dto';
import { ProductService } from './product.service';
import { imageValidator } from '../../infrastructure/storage/validators/image.validator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/utils/multerOptions.utils';
import { GetProductsDto } from './dto/getProducts.dto';

@UseGuards(RolesGuard)
@Roles(['admin'])
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(FilesInterceptor('attachments', 5, multerOptions))
  async addProduct(
    @Body() body: AddProductDto,
    @UploadedFiles(new ParseFilePipe({ validators: imageValidator }))
    images: Express.Multer.File[],
  ) {
    return await this.productService.addProduct(body, images);
  }

  async getProducts(@Query() query: GetProductsDto) {
    return await this.productService.getProducts(query);
  }
}
