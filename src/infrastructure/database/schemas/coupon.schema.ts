import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema';
import { DiscountType } from '../../../common/enums/discount.enum';

@Schema({ timestamps: true })
export class Coupon {
  @Prop({
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  })
  code: string;

  @Prop({ type: Number, default: 0 })
  minOrderAmount: number;

  @Prop({ type: String, enum: DiscountType })
  discountType: DiscountType;

  @Prop({ type: Number, required: true, min: 1 })
  discountValue: number;

  @Prop({ type: Number })
  maxDiscount?: number;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Number })
  usageLimit?: number;

  @Prop({ type: Number, default: 0 })
  usedCount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], default: [] })
  usedBy: Types.ObjectId[];
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
