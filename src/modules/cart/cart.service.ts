import { Injectable } from '@nestjs/common';
import { CartRepository } from '../../infrastructure/database/repositories/cart.repository';
import { ProductRepository } from '../../infrastructure/database/repositories/product.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async addToCart() {}

  async removeCartItem() {}

  async updateItemQuantity() {}

  async clearCart() {}
}
