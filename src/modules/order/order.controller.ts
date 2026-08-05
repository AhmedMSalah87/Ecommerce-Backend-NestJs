import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import type { Request } from 'express';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@UseGuards(RolesGuard)
@Roles([Role.CUSTOMER])
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() data: CreateOrderDto, @Req() req: Request) {
    await this.orderService.createOrder(data, req.user);
  }
}
