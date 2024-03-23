import {
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CardService } from './card.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserInfo } from 'utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { BoardRolesGuard } from 'src/auth/boardRoles.guard';
import { BoardRole } from 'src/board/types/boardmember-role.type';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(BoardRolesGuard)
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  //카드 이미지 삽입(수정)
  @Roles(BoardRole.OWNER, BoardRole.WORKER)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/:cardId/image')
  async insertMultiForm(
    @UserInfo() user: User,
    @Param('cardId', ParseIntPipe) cardId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(cardId);
    const insertMultForm = await this.cardService.insertMutiformForCard(
      user,
      cardId,
      file,
    );

    return insertMultForm;
  }
}
