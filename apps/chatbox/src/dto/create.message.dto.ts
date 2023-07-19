import { IsNotEmpty } from 'class-validator';

export class CreateMessage {
  @IsNotEmpty()
  readonly content: string;
}
