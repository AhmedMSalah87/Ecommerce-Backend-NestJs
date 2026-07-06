import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Brand,
  BrandSchema,
} from '../../infrastructure/database/schemas/brand.schema';
import { StorageModule } from '../../infrastructure/storage/storage.module';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandRepository } from '../../infrastructure/database/repositories/brand.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
    StorageModule,
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
})
export class BrandModule {}
