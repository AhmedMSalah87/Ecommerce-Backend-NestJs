import { Injectable } from '@nestjs/common';
import { Cart } from '../schemas/cart.schema';
import BaseRepository from './base.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CartRepository extends BaseRepository<Cart> {
  constructor(@InjectModel(Cart.name) model: Model<Cart>) {
    super(model);
  }
}
