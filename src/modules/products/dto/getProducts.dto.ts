import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetProductsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  sort?: string;

  @IsOptional()
  @IsIn(['desc', 'asc'])
  order?: 'desc' | 'asc';

  @IsOptional()
  @IsString()
  category?: string;
}
