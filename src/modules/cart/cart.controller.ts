import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/addToCart.dto';
import type { Request } from 'express';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/role.guard';
import { Role } from '../../common/enums/role.enum';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UpdateItemQuantityDto } from './dto/updateItemQuantity.dto';

@UseGuards(RolesGuard)
@Roles([Role.CUSTOMER])
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  async addToCart(@Body() data: AddToCartDto, @Req() req: Request) {
    await this.cartService.addToCart(data, req.user._id);
  }

  @Delete('items/:productId')
  async removeItem(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Req() req: Request,
  ) {
    await this.cartService.removeCartItem(productId, req.user._id);
  }

  @Get()
  async getCart(@Req() req: Request) {
    await this.cartService.getCart(req.user._id);
  }

  @Patch('items/:productId')
  async updateItemQuantity(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Req() req: Request,
    @Body() data: UpdateItemQuantityDto,
  ) {
    await this.cartService.updateItemQuantity(productId, req.user._id, data);
  }

  @Delete('items')
  async clearCart(@Req() req: Request) {
    await this.cartService.clearCart(req.user._id);
  }
}
