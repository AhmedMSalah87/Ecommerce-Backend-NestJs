import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Order,
  OrderSchema,
} from '../../infrastructure/database/schemas/order.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from '../../infrastructure/database/repositories/order.repository';
import { CartModule } from '../cart/cart.module';
import { CouponModule } from '../coupon/coupon.module';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartModule,
    CouponModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
