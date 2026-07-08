import { PartialType } from '@nestjs/mapped-types';
import { AddProductDto } from './addProduct.dto';
import { AtLeastOneField } from '../../../common/validators/atLeastOneField/atLeastOneField.decorator';

@AtLeastOneField(['name', 'slug', 'description', 'price', 'stock', 'isActive'])
export class UpdateProductDto extends PartialType(AddProductDto) {}
