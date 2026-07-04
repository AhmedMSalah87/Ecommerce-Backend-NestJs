import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}
}
