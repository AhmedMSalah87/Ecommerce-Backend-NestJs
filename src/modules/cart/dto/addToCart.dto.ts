import { IsInt, IsMongoId, Min } from 'class-validator';
import { Types } from 'mongoose';

export class AddToCartDto {
  @IsMongoId()
  productId: Types.ObjectId;

  @IsInt()
  @Min(1)
  quantity: number;
}
