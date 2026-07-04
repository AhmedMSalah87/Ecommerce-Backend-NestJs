import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import BaseRepository from './base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@InjectModel(User.name) model: Model<User>) {
    super(model);
  }

  async findUserById(userId: Types.ObjectId | string) {
    return this.model.findById(userId, { password: 0 });
  }

  async findUserByEmail(email: string) {
    return this.model.findOne({ email });
  }
}
