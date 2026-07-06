import { Injectable } from '@nestjs/common';
import { Brand } from '../schemas/brand.schema';
import BaseRepository from './base.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BrandRepository extends BaseRepository<Brand> {
  constructor(@InjectModel(Brand.name) model: Model<Brand>) {
    super(model);
  }
}
