import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaymentMethod } from '../../../common/enums/paymentMethod.enum';
import { Type } from 'class-transformer';
import { ShippingAddressDto } from './shippingAddress.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
