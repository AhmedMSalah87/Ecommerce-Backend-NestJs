import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Product,
  ProductSchema,
} from '../../infrastructure/database/schemas/product.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from '../../infrastructure/database/repositories/product.repository';
import { StorageModule } from '../../infrastructure/storage/storage.module';
import { BrandModule } from '../brands/brand.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    StorageModule,
    BrandModule,
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
