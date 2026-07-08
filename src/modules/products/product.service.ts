import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../infrastructure/database/repositories/product.repository';
import { StorageService } from '../../infrastructure/storage/storage.service';
import { AddProductDto } from './dto/addProduct.dto';
import { CategoryRepository } from '../../infrastructure/database/repositories/category.repository';
import { BrandRepository } from '../../infrastructure/database/repositories/brand.repository';
import { Types } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { GetProductsDto } from './dto/getProducts.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly brandRepo: BrandRepository,
    private readonly storage: StorageService,
  ) {}

  async addProduct(data: AddProductDto, images: Express.Multer.File[]) {
    const {
      name,
      slug,
      description,
      isActive,
      price,
      stock,
      discount,
      brandId,
      categoryId,
    } = data;
    const category = await this.categoryRepo.findById(categoryId);
    if (!category) {
      throw new NotFoundException('category not found');
    }
    const brand = await this.brandRepo.findById(brandId);
    if (!brand) {
      throw new NotFoundException('brand not found');
    }

    const calculatedPrice = price - price * ((discount ?? 0) / 100);
    const productId = new Types.ObjectId();
    const imageUrls: string[] = [];

    await Promise.all(
      images.map((image) => {
        const key = `products/${productId.toHexString()}/${randomUUID()}${extname(image.originalname)}`;
        imageUrls.push(key);
        return this.storage.upload(image, key);
      }),
    );
    try {
      return await this.productRepo.create({
        _id: productId,
        name,
        slug,
        description,
        price,
        brandId,
        categoryId,
        discount,
        isActive,
        stock,
        imageUrls,
        finalPrice: calculatedPrice,
      });
    } catch (err) {
      await this.storage.deleteMany(imageUrls);
      throw err;
    }
  }

  async updateProduct(
    productId: Types.ObjectId,
    data: UpdateProductDto,
    images: Express.Multer.File[],
  ) {
    const product = await this.productRepo.findById(productId);
    if (!product) {
      throw new NotFoundException('product not found');
    }

    const updatePayload: UpdateProductDto & { imagesUrls?: string[] } = {
      ...data,
    };
    const keys: string[] = [];
    if (images.length > 0) {
      await Promise.all(
        images.map((image) => {
          const key = `products/${productId.toHexString()}/${randomUUID()}${extname(image.originalname)}`;
          keys.push(key);
          return this.storage.upload(image, key);
        }),
      );
    }
    updatePayload.imagesUrls = keys;
    try {
      await this.productRepo.updateOne(
        { _id: productId },
        { $set: updatePayload },
      );
    } catch (err) {
      await this.storage.deleteMany(keys);
      throw err;
    }
  }

  async deleteProduct(productId: Types.ObjectId) {
    const product = await this.productRepo.findByIdAndDelete(productId);
    if (!product) {
      throw new NotFoundException('product not found');
    }
    await this.storage.deleteMany(product.imageUrls);
    return { message: 'product deleted successfully' };
  }

  async getProduct(productId: Types.ObjectId) {
    return await this.productRepo.findById(productId);
  }

  async getProducts(query: GetProductsDto) {
    const category = await this.categoryRepo.findOne({ slug: query.category });
    if (!category) {
      throw new NotFoundException('category not found');
    }
    const subCategories = await this.categoryRepo.find({
      parentId: category._id,
    });
    const allCategoriesIds = subCategories.map((category) => category._id);
    const { page, limit, sort, order } = query;
    const products = await this.productRepo.find(
      { categoryId: { $in: [...allCategoriesIds, category._id] } },
      {},
      {},
      { page, limit, sort, order },
    );

    return products;
  }
}
