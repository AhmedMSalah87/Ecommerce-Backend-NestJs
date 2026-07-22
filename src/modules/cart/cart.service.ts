import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository } from '../../infrastructure/database/repositories/cart.repository';
import { ProductRepository } from '../../infrastructure/database/repositories/product.repository';
import { Types } from 'mongoose';
import { AddToCartDto } from './dto/addToCart.dto';
import { UpdateItemQuantityDto } from './dto/updateItemQuantity.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async addToCart(data: AddToCartDto, userId: Types.ObjectId) {
    const { productId, quantity } = data;
    const product = await this.productRepo.findById(productId);
    if (!product) {
      throw new NotFoundException('product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('insufficient product stock');
    }

    let cart = await this.cartRepo.findOne({ userId });
    if (!cart) {
      cart = await this.cartRepo.create({
        items: [{ productId, quantity }],
        userId,
      });
      return cart;
    }
    const item = cart.items.find(
      (item) => item.productId.toString() === productId.toString(),
    );
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    return { message: 'items added to cart successfully' };
  }

  async removeCartItem(productId: Types.ObjectId, userId: Types.ObjectId) {
    const cart = await this.cartRepo.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('cart not found');
    }
    const originalLength = cart.items.length;
    cart.items = cart.items.filter((item) => !item.productId.equals(productId));
    if (cart.items.length === originalLength) {
      throw new NotFoundException('product not found in cart');
    }
    await cart.save();
    return { message: 'item removed successfully from cart' };
  }

  async updateItemQuantity(
    productId: Types.ObjectId,
    userId: Types.ObjectId,
    data: UpdateItemQuantityDto,
  ) {
    const { quantity } = data;
    const cart = await this.cartRepo.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('cart not found');
    }
    const item = cart.items.find((item) => item.productId.equals(productId));
    if (!item) {
      throw new NotFoundException('cart item not found');
    }
    item.quantity += quantity;
    await cart.save();
    return { message: 'item quantity updated successfully' };
  }

  async clearCart(userId: Types.ObjectId) {
    await this.cartRepo.findOneAndDelete({ userId });
    return { message: 'cart cleared successfully' };
  }

  async getCart(userId: Types.ObjectId) {
    const cart = await this.cartRepo.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('cart not found');
    }
    const productIds = cart.items.map((item) => item.productId);
    const products = await this.productRepo.find({
      _id: { $in: productIds },
      isActive: true,
    });
    const productsMap = new Map(
      products.map((product) => [product._id.toString(), product]),
    );
    let subtotal = 0;
    const items = cart.items.map((item) => {
      const product = productsMap.get(item.productId.toString());
      if (!product) {
        throw new NotFoundException('item not found in cart');
      }
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;
      return {
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      };
    });
    return { items, subtotal };
  }
}
