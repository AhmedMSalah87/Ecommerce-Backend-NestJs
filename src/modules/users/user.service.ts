import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../db/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { hashValue } from '../../common/utils/hash.utils';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getUser() {
    return this.userModel.findOne();
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async createUser(data: CreateUserDto) {
    const { firstName, lastName, email, password } = data;
    const emailExist = await this.findUserByEmail(email);
    if (emailExist) {
      throw new ConflictException('email already exist');
    }
    return await this.userModel.create({
      firstName,
      lastName,
      email,
      password: await hashValue(password),
    });
  }
}
