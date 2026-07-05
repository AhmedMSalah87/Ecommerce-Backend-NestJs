import { PartialType } from '@nestjs/mapped-types';
import { AddCategoryDto } from './addCategory.dto';
import { AtLeastOneField } from '../../../common/validators/atLeastOneField/atLeastOneField.decorator';

@AtLeastOneField(['name', 'slug', 'isActive'])
export class UpdateCategoryDto extends PartialType(AddCategoryDto) {}
