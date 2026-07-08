import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsMongoId, IsString, Min } from 'class-validator';
import { Types } from 'mongoose';
import { TransformBoolean } from '../../../common/decorators/transformBoolean.decorator';

export class AddProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  discount?: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @IsMongoId()
  categoryId: Types.ObjectId;

  @IsMongoId()
  brandId: Types.ObjectId;

  @IsBoolean()
  @TransformBoolean()
  isActive: boolean;
}
