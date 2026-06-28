import { CustomerPermissions } from '../enums/customer.enum';
import { Role } from '../enums/role.enum';

export const RolePermissions = {
  [Role.CUSTOMER]: Object.values(CustomerPermissions),
  [Role.ADMIN]: [],
  [Role.STAFF]: [],
};
