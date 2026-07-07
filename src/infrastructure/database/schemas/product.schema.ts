import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from './category.schema';
import { Brand } from './brand.schema';

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  slug: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true, index: true, min: 0 })
  price: number;

  @Prop({ type: Number, default: 0, min: 0 })
  discount: number;

  @Prop({ type: Number, default: 0, min: 0 })
  stock: number;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Category.name,
    index: true,
  })
  categoryId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Brand.name,
    index: true,
  })
  brandId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  imageUrls: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = HydratedDocument<Product>;
