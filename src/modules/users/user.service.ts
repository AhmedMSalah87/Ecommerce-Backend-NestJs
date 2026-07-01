import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../db/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}
}
