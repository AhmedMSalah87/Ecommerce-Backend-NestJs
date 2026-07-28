import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema';
import { OrderItem, OrderItemsSchema } from './orderItem.schema';
import {
  ShippingAddress,
  ShippingAddressSchema,
} from './shippingAddress.schema';
import { PaymentMethod } from '../../../common/enums/paymentMethod.enum';
import { PaymentStatus } from '../../../common/enums/paymentStatus.enum';
import { OrderStatus } from '../../../common/enums/orderStatus.enum';

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  subtotal: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  shippingCost: number;

  @Prop({ required: true })
  total: number;

  @Prop({ type: [OrderItemsSchema], required: true })
  items: OrderItem[];

  @Prop()
  couponId?: Types.ObjectId;

  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  orderStatus: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
