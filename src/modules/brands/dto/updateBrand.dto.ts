import { PartialType } from '@nestjs/mapped-types';
import { AtLeastOneField } from '../../../common/validators/atLeastOneField/atLeastOneField.decorator';
import { AddBrandDto } from './addBrand.dto';

@AtLeastOneField(['name', 'slug', 'isActive'])
export class UpdateBrandDto extends PartialType(AddBrandDto) {}
