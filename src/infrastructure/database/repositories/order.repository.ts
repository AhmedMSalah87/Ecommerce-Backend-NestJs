import { Model } from 'mongoose';
import { Order } from '../schemas/order.schema';
import BaseRepository from './base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(@InjectModel(Order.name) model: Model<Order>) {
    super(model);
  }
}
