import { Test, TestingModule } from '@nestjs/testing';
import { ColumnService } from './column.service';
import { Admin, Repository } from 'typeorm';
import { Columns } from './entities/column.entity';
import { Board } from '../board/entity/board.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChangeColumnDto } from './dto/change.column.dto';
import { NotFoundException } from '@nestjs/common';
import { Role } from 'src/user/types/userRole.type';
import { User } from 'src/user/entities/user.entity';

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

  describe('createColumn', () => {
    it('정상적으로 컬럼이 생성된다', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        password: '123456',
        name: '테스트',
        role: Role.Admin,
        company: '회사',
        createdAt: new Date('2024-03-22'),
        updatedAt: new Date('2024-03-22'),
        deletedAt: null,
      };
      const boardId = 1;
      const title = '이름';
      const procedure = 1;
      const createColumnDto = { title, procedure };

      const board = {
        id: 1,
        title: '보드이름',
        description: '보드설명',
        color: '123456',
        created_at: new Date('2024-03-22'),
        updated_at: new Date('2024-03-22'),
      } as Board;

      boardRepositoryMock.findOne.mockResolvedValue(board);

      const column = {
        id: 1,
        title: '이름',
        created_at: '2024-03-22',
        updated_at: '2024-03-22',
        procedure: 3.1,
        board_id: 1,
      };

      columnRepositoryMock.save.mockResolvedValue(column);

      // columnRepositoryMock.find.mockResolvedValue({
      //   {id:1,
      //   procedure:2.2},
      //   {
      //     id:2,
      //     procedure:3.3
      //   }
      // });
      //수정필요

      const boards = await columnRepositoryMock.find({
        where: { boardId },
        select: ['id', 'procedure'],
      });

      const decimalProcedure = await service.boardList(boards, procedure);

      const result = await service.createColumn(user, boardId, createColumnDto);
      expect(boardRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(boardRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: boardId },
      });
      expect(columnRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(columnRepositoryMock.save).toHaveBeenCalledWith({
        title,
        procedure: decimalProcedure,
        boardId,
        user_id: user.id,
      });

      expect(result).toBe(undefined);
    });
  });

  describe('updateColumn', () => {
    it('존재하지않는 컬럼 id가 주어지면 컬럼을 찾을 수 없다는 예외를 던진다', async () => {
      const columnId = 1;
      const title = '컬럼 이름';
      const changeColumnDto = { title };
      jest.spyOn(columnRepositoryMock, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateColumn(columnId, changeColumnDto),
      ).rejects.toThrow();
    });

    it('알맞은 컬럼 id가 주어지면 해당 id의 컬럼 이름을 수정한다.', async () => {
      const columnId = 1;
      const title = '컬럼 이름';
      const changeColumnDto = { title };

      const originColumn = {
        id: 1,
        title: '이름',
        created_at: '2024-03-22',
        updated_at: '2024-03-22',
        procedure: 3.1,
        board_id: 1,
      };

      columnRepositoryMock.findOne.mockResolvedValue(originColumn);

      // jest
      //   .spyOn(columnRepositoryMock, 'findOne')
      //   .mockResolvedValue(originColumn);

      const result = await service.updateColumn(columnId, changeColumnDto);

      const updateResult = {
        id: 1,
        title,
        created_at: '2024-03-22',
        updated_at: '2024-03-22',
        procedure: 3.1,
        board_id: 1,
      };
      expect(columnRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(columnRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: columnId },
      });
      expect(result).toBe(undefined);
    });
  });
});
