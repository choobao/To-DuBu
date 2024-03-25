import { IsNotEmpty, IsNumber } from "class-validator"


export class ModifyWorkerDto {
  @IsNotEmpty()
  @IsNumber()
  user: number
}