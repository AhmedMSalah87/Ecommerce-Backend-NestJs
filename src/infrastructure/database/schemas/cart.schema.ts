import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema';
import { Product } from './product.schema';

@Schema({ _id: false })
export class CartItem {
  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  productId: Types.ObjectId;

  @Prop({
    required: true,
    min: 1,
  })
  quantity: number;
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: [CartItem] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
