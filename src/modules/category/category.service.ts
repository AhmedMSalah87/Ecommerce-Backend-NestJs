import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../../infrastructure/database/repositories/category.repository';
import { AddCategoryDto } from './dto/addCategory.dto';
import { Types } from 'mongoose';
import { StorageService } from '../../infrastructure/storage/storage.service';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepository,
    private readonly storage: StorageService,
  ) {}

  async addCategory(data: AddCategoryDto, image: Express.Multer.File) {
    const { name, slug, isActive, parentId } = data;
    const categoryId = new Types.ObjectId();
    const key = `categories/${categoryId.toHexString()}/${randomUUID()}.${extname(image.originalname)}`;
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
    } catch (error) {
      await this.storage.delete(key);
      console.error(error);
    }
  }

  async deleteCategory(categoryId: Types.ObjectId) {
    const category = await this.categoryRepo.findByIdAndDelete(categoryId);
    if (!category) {
      throw new NotFoundException('category not found');
    }
    await this.storage.delete(category.imageUrl);
    return { message: 'category deleted successfully' };
  }
}
