import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CouponRepository } from '../../infrastructure/database/repositories/coupon.repository';
import { CreateCouponDto } from './dto/createCoupon.dto';
import { Coupon } from '../../infrastructure/database/schemas/coupon.schema';
import { DiscountType } from '../../common/enums/discount.enum';
import { ApplyCouponDto } from './dto/applyCoupon.dto';
import { ClientSession, Types } from 'mongoose';

@Injectable()
export class CouponService {
  constructor(private readonly couponRepo: CouponRepository) {}

  async createCoupon(data: CreateCouponDto) {
    const { code, startDate } = data;
    const coupon = await this.couponRepo.findOne({ code });
    if (coupon) {
      throw new ConflictException('coupon already exists');
    }
    if (startDate.getTime() < Date.now()) {
      throw new BadRequestException('start date must be now or after');
    }
    await this.couponRepo.create({
      ...data,
    });

    return { message: 'coupon created successfully', coupon };
  }

  async applyCoupon(data: ApplyCouponDto) {
    const { code, userId, subtotal } = data;
    const coupon = await this.couponRepo.findOne({ code });
    if (!coupon) {
      throw new NotFoundException('coupon not found');
    }
    if (!coupon.isActive) {
      throw new BadRequestException('coupon is inactive');
    }
    if (coupon.endDate.getTime() < Date.now()) {
      throw new BadRequestException('coupon has expired');
    }
    if (coupon.usedBy.some((id) => id.equals(userId))) {
      throw new BadRequestException('coupon already used');
    }
    if (coupon.usageLimit && coupon.usedBy.length >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      throw new BadRequestException(
        `Minimum order is ${coupon.minOrderAmount}`,
      );
    }
    const discount = this.calculateDiscount(subtotal, coupon);
    return { couponId: coupon._id, discount, finalTotal: subtotal - discount };
  }

  async consumeCoupon(
    couponId: Types.ObjectId,
    userId: Types.ObjectId,
    session?: ClientSession,
  ) {
    const coupon = await this.couponRepo.findOneAndUpdate(
      {
        _id: couponId,
        isActive: true,
        usedBy: { $ne: userId },
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
        $or: [
          { usageLimit: { $exists: false } },
          { $expr: { $lt: ['$usedCount', '$usageLimit'] } }, //$expr used for comparison of two fields on the same document
        ],
      },
      { $addToSet: { usedBy: userId }, $inc: { usedCount: 1 } },
      { session },
    );
    if (!coupon) {
      throw new BadRequestException(
        'Coupon is invalid, expired, already used, or has reached its usage limit',
      );
    }
  }

  //calculate and return the discount amount
  private calculateDiscount(subtotal: number, coupon: Coupon) {
    let discount = 0;
    if (coupon.discountType === DiscountType.percentage) {
      discount = subtotal * (coupon.discountValue / 100);
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    return Math.min(discount, subtotal); //to prevent discount larger than subtotal
  }
}
