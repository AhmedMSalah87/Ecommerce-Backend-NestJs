import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUppercase,
  Length,
  Validate,
  ValidateIf,
} from 'class-validator';
import { TransformBoolean } from '../../../common/decorators/transformBoolean.decorator';
import { DiscountType } from '../../../common/enums/discount.enum';
import { CouponValidator } from '../../../common/validators/couponValidator/couponValidator.constraint';
import { IsAfter } from '../../../common/validators/isAfter/isAfter.decorator';

export class CreateCouponDto {
  @IsString()
  @IsUppercase()
  @Length(3, 30)
  code: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  minOrderAmount: number;

  @IsEnum(DiscountType)
  discountType: DiscountType;

  @Validate(CouponValidator)
  @IsInt()
  discountValue: number;

  @ValidateIf(
    (data: CreateCouponDto) => data.discountType === DiscountType.percentage,
  )
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  maxDiscount?: number;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsAfter('startDate')
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  isActive: boolean;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  usageLimit?: number;
}
