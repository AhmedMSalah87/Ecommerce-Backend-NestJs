import { IsInt, IsOptional, IsString } from 'class-validator';

export class ShippingAddressDto {
  @IsString()
  fullName: string;

  @IsInt()
  phone: number;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsInt()
  postalCode?: number;
}
