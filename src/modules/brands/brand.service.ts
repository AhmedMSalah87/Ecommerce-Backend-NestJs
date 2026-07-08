import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { StorageService } from '../../infrastructure/storage/storage.service';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { BrandRepository } from '../../infrastructure/database/repositories/brand.repository';
import { AddBrandDto } from './dto/addBrand.dto';
import { UpdateBrandDto } from './dto/updateBrand.dto';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepo: BrandRepository,
    private readonly storage: StorageService,
  ) {}

  async addBrand(data: AddBrandDto, logo: Express.Multer.File) {
    const { name, slug, isActive } = data;
    const brandId = new Types.ObjectId();
    const key = `categories/${brandId.toHexString()}/${randomUUID()}${extname(logo.originalname)}`;
    await this.storage.upload(logo, key);
    try {
      return await this.brandRepo.create({
        _id: brandId,
        name,
        slug,
        logoUrl: key,
        isActive: isActive ?? true,
      });
    } catch (err) {
      console.error(err);
      await this.storage.delete(key);
    }
  }

  async updateBrand(
    brandId: Types.ObjectId,
    data: UpdateBrandDto,
    image?: Express.Multer.File,
  ) {
    const brand = await this.brandRepo.findById(brandId);
    if (!brand) {
      throw new NotFoundException('brand not found');
    }
    const updatedPayload: UpdateBrandDto & { logoUrl?: string } = {
      ...data,
    };
    let key: string | undefined;
    if (image) {
      key = `brands/${brandId.toHexString()}/${randomUUID()}${extname(image.originalname)}`;
      await this.storage.upload(image, key);
      updatedPayload.logoUrl = key;
    }
    try {
      await this.brandRepo.updateOne(
        { _id: brandId },
        { $set: updatedPayload },
      );
    } catch (err) {
      console.error(err);
      if (key) {
        await this.storage.delete(key);
      }
    }

    return { message: 'brand updated successfully' };
  }

  async deleteBrand(brandId: Types.ObjectId) {
    const brand = await this.brandRepo.findById(brandId);
    if (!brand) {
      throw new NotFoundException('brand not found');
    }
    brand.isDeleted = true;
    brand.deletedAt = new Date();
    await brand.save();
    return { message: 'brand marked as deleted' };
  }
}
