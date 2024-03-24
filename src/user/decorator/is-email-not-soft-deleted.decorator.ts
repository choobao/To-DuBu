// import {
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
//   ValidationArguments,
// } from 'class-validator';
// import { Injectable } from '@nestjs/common';
// import { UserService } from '../user.service';

// // 회원가잆 시 입력한 이메일이 회원탈퇴(softDelete) 처리된 사용자인지 확인하는 데코레이터
// @Injectable()
// @ValidatorConstraint({ name: 'isDeletedEmail', async: true })
// export class IsDeletedEmailValidator implements ValidatorConstraintInterface {
//   constructor(private readonly userService: UserService) {}

//   async validate(email: string, args: ValidationArguments) {
//     // 유효성을 검사할 이메일 주소와 추가 유효성 검사 인수를 받음
//     const user = await this.userService.findByEmail(email, {
//       // 'UserService'의 'findByEmail' 메서드를 호출하여 일시 삭제된 사용자를 포함하여 지정된 이메일 주소를 가진 사용자를 검색
//       withDeleted: true,
//     });
//     return user && user.deleted_at !== null; // 사용자가 발견되고 'deleted_at' 필드가 null이 아닌 경우 'true'를 반환하여 이메일 주소가 일시 삭제된 사용자와 연결되어 있음을 나타냄
//   }

//   defaultMessage(args: ValidationArguments) {
//     return '탈퇴 처리된 이메일입니다';
//   }
// }
