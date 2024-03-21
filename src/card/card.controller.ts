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
  UseInterceptors,
} from '@nestjs/common';
import { CardService } from './card.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCardDto } from './dto/card.create.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  async createCard(@Body() createCardDto: CreateCardDto) {
    return await this.cardService.createCard(createCardDto)
  }

  @Get()
  async getCards() {
    return await this.cardService.findAll()
  }

  @Post('move')
  async moveCard(@Body() body: {cardId: number, whereId: number}) {
    await this.cardService.moveCard(body.cardId, body.whereId)
    return await this.cardService.findAll()
  }

  @Delete('delete/:cardId')
  async deleteCard(@Param('cardId') cardId: number ) {
    await this.cardService.deleteCard(cardId)
  }
}
  // //카드 이미지 삽입(수정)
  // @UseInterceptors(FileInterceptor('file'))
  // @Patch('/:cardId/image')
  // async insertMultiForm(
  //   @Param('cardId', ParseIntPipe) cardId: number,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   const insertMultForm = await this.cardService.insertMutiformForCard(
  //     cardId,
  //     file,
  //   );

  //   return insertMultForm;
  // }