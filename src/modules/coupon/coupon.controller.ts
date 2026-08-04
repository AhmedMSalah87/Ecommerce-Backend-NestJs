import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateCouponDto } from './dto/createCoupon.dto';

@UseGuards(RolesGuard)
@Roles([Role.ADMIN])
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  async createCoupon(@Body() data: CreateCouponDto) {
    return await this.couponService.createCoupon(data);
  }
}
