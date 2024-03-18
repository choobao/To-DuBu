import { Injectable } from '@nestjs/common';
import { Columns } from './entities/column.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(Columns)
    private readonly columnRepository: Repository<Columns>,
  ) {}

  //컬럼 생성
  //   async createColumn();

  //컬럼 이름 수정

  //컬럼 삭제

  //컬럼 순서 이동
}
