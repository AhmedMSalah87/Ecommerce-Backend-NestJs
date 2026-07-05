import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TransformBoolean } from '../../../common/decorators/transformBoolean.decorator';

export class AddCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug: string;

  @IsBoolean()
  @IsOptional()
  @TransformBoolean()
  isActive: boolean;

  @IsMongoId()
  @IsOptional()
  parentId: string;
}
