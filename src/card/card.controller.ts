import {
  Controller,
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

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  //카드 이미지 삽입(수정)
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/:cardId/image')
  async insertMultiForm(
    @Param('cardId', ParseIntPipe) cardId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const insertMultForm = await this.cardService.insertMutiformForCard(
      cardId,
      file,
    );

    return insertMultForm;
  }
}
