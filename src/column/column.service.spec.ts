import { Test, TestingModule } from '@nestjs/testing';
import { ColumnService } from './column.service';
import { Repository } from 'typeorm';
import { Columns } from './entities/column.entity';
import { Board } from 'src/board/entity/board.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChangeColumnDto } from './dto/change.column.dto';

describe('ColumnService', () => {
  let service: ColumnService;
  let columnRepositoryMock: Partial<
    Record<keyof Repository<Columns>, jest.Mock>
  >;
  let boardRepositoryMock: Partial<Record<keyof Repository<Board>, jest.Mock>>;

  beforeEach(async () => {
    columnRepositoryMock = {
      find: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    boardRepositoryMock = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColumnService,
        {
          provide: getRepositoryToken(Columns),
          useValue: columnRepositoryMock,
        },
        {
          provide: getRepositoryToken(Board),
          useValue: boardRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ColumnService>(ColumnService);
  });

  describe('update', () => {
    it('존재하지않는 컬럼 id가 주어지면 컬럼을 찾을 수 없다는 예외를 던진다', async () => {
      const columnId = 1;
      const title = ChangeColumnDto;
      jest.spyOn(columnRepositoryMock, 'findOne').mockResolvedValue(null);

      // await expect(service.updateColumn(columnId, title));

      // const result = async () => {
      //   await ColumnService.columnRepositoryMock.update(title);
      // };
    });
  });
});
