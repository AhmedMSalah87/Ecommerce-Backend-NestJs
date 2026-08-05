import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepository } from '../../infrastructure/database/repositories/order.repository';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Connection } from 'mongoose';
import { CouponService } from '../coupon/coupon.service';
import { CartService } from '../cart/cart.service';
import { PaymentMethod } from '../../common/enums/paymentMethod.enum';
import { PaymentStatus } from '../../common/enums/paymentStatus.enum';
import { OrderStatus } from '../../common/enums/orderStatus.enum';
import { ProductRepository } from '../../infrastructure/database/repositories/product.repository';
import { InjectConnection } from '@nestjs/mongoose';
import { PaymentService } from '../../infrastructure/payment/payment.service';
import { UserDocument } from '../../infrastructure/database/schemas/user.schema';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly couponService: CouponService,
    private readonly cartService: CartService,
    private readonly productRepo: ProductRepository,
    @InjectConnection() private readonly connection: Connection,
    private readonly paymentService: PaymentService,
  ) {}

  async createOrder(data: CreateOrderDto, user: UserDocument) {
    const { paymentMethod, shippingAddress, couponCode } = data;
    //get cart
    const { cart } = await this.cartService.getCart(user._id);
    if (!cart) {
      throw new BadRequestException('cart not exist');
    }
    const { items, subtotal } = await this.cartService.buildCartItems(cart);
    //validate and apply coupon
    const couponResult = couponCode
      ? await this.couponService.applyCoupon({
          code: couponCode,
          subtotal,
          userId: user._id,
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
            userId: user._id,
            paymentMethod,
            paymentStatus: PaymentStatus.PENDING,
            shippingAddress,
            orderStatus: OrderStatus.PENDING,
          },
          session,
        );
        //consume coupon
        if (couponResult) {
          await this.couponService.consumeCoupon(
            couponResult.couponId,
            user._id,
            session,
          );
        }
        //update stock
        await this.productRepo.decreaseStock(order.items, session);
        //clear cart
        await this.cartService.clearCart(user._id, session);
        //pay online if payment method is card
        if (data.paymentMethod === PaymentMethod.CARD) {
          const checkoutItems = items.map((item) => ({
            name: item.productName,
            quantity: item.quantity,
            price: item.unitPrice,
          }));
          const checkoutSession = await this.paymentService.payOnline(
            checkoutItems,
            { orderId: order._id.toString() },
            user.email,
          );
          return checkoutSession;
        }
        return order;
      });
    } finally {
      await session.endSession();
    }
  }
}
