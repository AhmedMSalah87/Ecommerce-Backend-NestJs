import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepository } from '../../infrastructure/database/repositories/order.repository';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Connection, Types } from 'mongoose';
import { CouponService } from '../coupon/coupon.service';
import { CartService } from '../cart/cart.service';
import { PaymentMethod } from '../../common/enums/paymentMethod.enum';
import { PaymentStatus } from '../../common/enums/paymentStatus.enum';
import { OrderStatus } from '../../common/enums/orderStatus.enum';
import { ProductRepository } from '../../infrastructure/database/repositories/product.repository';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly couponService: CouponService,
    private readonly cartService: CartService,
    private readonly productRepo: ProductRepository,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createOrder(data: CreateOrderDto, userId: Types.ObjectId) {
    const { paymentMethod, shippingAddress, couponCode } = data;
    //get cart
    const { cart } = await this.cartService.getCart(userId);
    if (!cart) {
      throw new BadRequestException('cart not exist');
    }
    const { items, subtotal } = await this.cartService.buildCartItems(cart);
    //validate and apply coupon
    const couponResult = couponCode
      ? await this.couponService.applyCoupon({
          code: couponCode,
          subtotal,
          userId,
        })
      : undefined;
    const discount = couponResult?.discount ?? 0;
    const total = couponResult?.finalTotal ?? subtotal;
    //create transaction session
    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        //create order
        const order = await this.orderRepo.create(
          {
            couponId: couponResult?.couponId,
            discount,
            items,
            subtotal,
            total,
            userId,
            paymentMethod,
            paymentStatus:
              paymentMethod === PaymentMethod.COD
                ? PaymentStatus.PENDING
                : PaymentStatus.PAID,
            shippingAddress,
            orderStatus: OrderStatus.PENDING,
          },
          session,
        );
        //consume coupon
        if (couponResult) {
          await this.couponService.consumeCoupon(
            couponResult.couponId,
            userId,
            session,
          );
        }
        //update stock
        await this.productRepo.decreaseStock(order.items, session);
        //clear cart
        await this.cartService.clearCart(userId, session);
        return order;
      });
    } finally {
      await session.endSession();
    }
  }
}
