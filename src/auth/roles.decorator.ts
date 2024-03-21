import { Role } from 'src/user/types/userRole.type';
import { BoardRole } from 'src/board/types/boardmember-role.type';

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: Role[] | BoardRole[]) => {
  const stringRoles = roles.map(String);
  return SetMetadata('roles', stringRoles);
};
