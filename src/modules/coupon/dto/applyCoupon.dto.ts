import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNumber,
  IsPositive,
  IsString,
  IsUppercase,
  Length,
} from 'class-validator';
import { Types } from 'mongoose';

export class ApplyCouponDto {
  @IsString()
  @IsUppercase()
  @Length(3, 30)
  code: string;

  @IsMongoId()
  userId: Types.ObjectId;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  subtotal: number;
}
