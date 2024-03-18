import { Role } from 'src/user/types/userRole.type';

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: Role[]) => {
  const stringRoles = roles.map(String); // sqlite3 는 자체 enum 을 지원안해서 문자열로 바꿔서 쓰고 있음
  return SetMetadata('roles', stringRoles);
};
