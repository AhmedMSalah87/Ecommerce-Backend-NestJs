import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Brand {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true, unique: true })
  slug: string;

  @Prop({ type: String, required: true })
  logoUrl: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
export type BrandDocument = HydratedDocument<Brand>;
