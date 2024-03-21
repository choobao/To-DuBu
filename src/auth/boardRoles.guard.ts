/* eslint-disable @typescript-eslint/no-unused-vars */
import { BoardRole } from 'src/board/types/boardmember-role.type';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import _ from 'lodash';

@Injectable()
export class BoardRolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<BoardRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const { boardId } = req.params;

    const userInfo = req.user.boardInfo.filter(
      (info) => info.board_id === +boardId,
    )[0];

    if (_.isNil(userInfo)) throw new NotFoundException();
    return requiredRoles.some((role) => +role === userInfo.role);
  }
}
