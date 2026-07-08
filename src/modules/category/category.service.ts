import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../../infrastructure/database/repositories/category.repository';
import { AddCategoryDto } from './dto/addCategory.dto';
import { Types } from 'mongoose';
import { StorageService } from '../../infrastructure/storage/storage.service';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { PaginationOptions } from '../../types/pagination.type';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepository,
    private readonly storage: StorageService,
  ) {}

  async addCategory(data: AddCategoryDto, image: Express.Multer.File) {
    const { name, slug, isActive, parentId } = data;
    const categoryId = new Types.ObjectId();
    const key = `categories/${categoryId.toHexString()}/${randomUUID()}${extname(image.originalname)}`;
    await this.storage.upload(image, key);
    try {
      return await this.categoryRepo.create({
        _id: categoryId,
        name,
        slug,
        imageUrl: key,
        isActive: isActive ?? true,
        parentId: parentId ? new Types.ObjectId(parentId) : undefined,
      });
    } catch (err) {
      console.error(err);
      await this.storage.delete(key);
    }
  }

  async updateCategory(
    categoryId: Types.ObjectId,
    data: UpdateCategoryDto,
    image?: Express.Multer.File,
  ) {
    const category = await this.categoryRepo.findById(categoryId);
    if (!category) {
      throw new NotFoundException('category not found');
    }
    const updatedPayload: UpdateCategoryDto & { imageUrl?: string } = {
      ...data,
    };
    let key: string | undefined;
    if (image) {
      key = `categories/${categoryId.toHexString()}/${randomUUID()}${extname(image.originalname)}`;
      await this.storage.upload(image, key);
      updatedPayload.imageUrl = key;
    }
    try {
      await this.categoryRepo.updateOne(
        { _id: categoryId },
        { $set: updatedPayload },
      );
    } catch (err) {
      console.error(err);
      if (key) {
        await this.storage.delete(key);
      }
    }

    return { message: 'category updated successfully' };
  }

  async deleteCategory(categoryId: Types.ObjectId) {
    const category = await this.categoryRepo.findByIdAndDelete(categoryId);
    if (!category) {
      throw new NotFoundException('category not found');
    }
    await this.storage.delete(category.imageUrl);
    return { message: 'category deleted successfully' };
  }

  async getCategories(pagination: PaginationOptions) {
    return this.categoryRepo.find({ parentId: null }, {}, {}, pagination);
  }

  async getCategory(slug: string) {
    return this.categoryRepo.findOne({ slug });
  }

  //get subcategories of parent category
  async getSubCategories(slug: string) {
    const parentCategory = await this.categoryRepo.findOne({ slug });
    if (!parentCategory) {
      throw new NotFoundException('parent category not found');
    }
    return this.categoryRepo.find({ parentId: parentCategory._id });
  }
}
