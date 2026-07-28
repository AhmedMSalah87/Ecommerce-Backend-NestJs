import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateCouponDto } from '../../../modules/coupon/dto/createCoupon.dto';
import { DiscountType } from '../../enums/discount.enum';

@ValidatorConstraint({ name: 'CouponValidator', async: false })
export class CouponValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const coupon = args.object as CreateCouponDto;
    if (coupon.discountType === DiscountType.fixed) {
      return coupon.discountValue > 0;
    }
    if (coupon.discountType === DiscountType.percentage) {
      return coupon.discountValue > 0 && coupon.discountValue <= 100;
    }
    return false;
  }

  defaultMessage(): string {
    return 'Invalid discount value';
  }
}
