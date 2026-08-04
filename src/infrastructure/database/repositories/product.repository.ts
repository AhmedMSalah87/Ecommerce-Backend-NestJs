import { ClientSession, Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import BaseRepository from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { OrderItem } from '../schemas/orderItem.schema';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(@InjectModel(Product.name) model: Model<Product>) {
    super(model);
  }
  async decreaseStock(items: OrderItem[], session?: ClientSession) {
    await this.model.bulkWrite(
      items.map((item) => ({
        updateOne: {
          filter: { _id: item.productId, stock: { $gte: item.quantity } },
          update: { $inc: { stock: -item.quantity } },
        },
      })),
      { session },
    );
  }
}
