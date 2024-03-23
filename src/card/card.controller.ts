import {
  Body,
  Controller,
  Delete,
  Get,
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
import { CreateCardDto } from './dto/card.create.dto';
import { UpdateCardDto } from './dto/card.update.dto';
import { UserInfo } from 'utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { BoardRolesGuard } from 'src/auth/boardRoles.guard';
import { BoardRole } from 'src/board/types/boardmember-role.type';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(BoardRolesGuard)
@Controller('boards/:boardId/card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Roles(BoardRole.OWNER, BoardRole.WORKER)
  @Post()
  async createCard(
    @Body() createCardDto: CreateCardDto
    ) {
    return await this.cardService.createCard(createCardDto)
  }

  @Roles(BoardRole.OWNER, BoardRole.WORKER)
  @Get()
  async getCards() {
    return await this.cardService.findAll()
  }

  @Roles(BoardRole.OWNER, BoardRole.WORKER)
  @Post('move')
  async moveCard(
    @Body() body: {cardId: number, whereId: number}
    ) {
    await this.cardService.moveCard(body.cardId, body.whereId)
    return await this.cardService.findAll()
  }

  @Roles(BoardRole.OWNER, BoardRole.WORKER)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/:cardId')
  async modifyCard(
    @UserInfo() user: User,
    @Param('cardId', ParseIntPipe)cardId: number,
    @Body() updateCardDto: UpdateCardDto,
  @UploadedFile() file: Express.Multer.File
  ) {
    const updatedDate = await this.cardService.modifyCard(user, cardId, updateCardDto, file )
    return updatedDate
  }

  @Roles(BoardRole.OWNER, BoardRole.WORKER)
  @Delete('/:cardId')
  async deleteCard(
    @Param('cardId') cardId: number,
    @UserInfo() user: User,
    ) {
    await this.cardService.deleteCard(user, cardId)
  }
}