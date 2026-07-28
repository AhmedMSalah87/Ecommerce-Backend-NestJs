import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true, ref: Product.name })
  productId: Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  subtotal: number;
}

export const OrderItemsSchema = SchemaFactory.createForClass(OrderItem);
