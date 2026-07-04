import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true, unique: true })
  slug: string;

  @Prop({ type: String, required: true })
  imageUrl: string;

  @Prop({
    type: Types.ObjectId,
    ref: Category.name,
    default: null,
    index: true,
  })
  parentId: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export type UserDocument = HydratedDocument<Category>;
