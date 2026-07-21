import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Cart,
  CartSchema,
} from '../../infrastructure/database/schemas/cart.schema';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from '../../infrastructure/database/repositories/cart.repository';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
})
export class CartModule {}
