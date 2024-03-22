import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // AuthGuard를 확장하고 'jwt'를 전략으로 지정(Passport.js에 구성된 JWT 전략을 사용)
  canActivate(context: ExecutionContext) {
    // HTTP 요청에 대한 인증 여부를 결정
    // ExecutionContext를 사용하여 현재 실행 컨텍스트(예: HTTP 요청)에 액세스
    const request = context.switchToHttp().getRequest();
    if (request.url.includes('/user/unregister')) {
      // 요청 URL에 '/user/unregister'가 포함되어 있는지 확인
      // '/user/unregister' 경로는 인증 없이 접근할 수 있도록 허용
      return true;
    }
    // 다른 경로에 대해서는 원래의 AuthGuard의 canActivate 메서드를 호출하여 인증을 진행
    return super.canActivate(context);
  }
}
