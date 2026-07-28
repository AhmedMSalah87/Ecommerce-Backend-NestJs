import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponRepository } from '../../infrastructure/database/repositories/coupon.repository';
import { CouponService } from './coupon.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Coupon,
  CouponSchema,
} from '../../infrastructure/database/schemas/coupon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }]),
  ],
  controllers: [CouponController],
  providers: [CouponService, CouponRepository],
  exports: [],
})
export class CouponModule {}
