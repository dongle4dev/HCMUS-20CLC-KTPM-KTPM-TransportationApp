import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


// Định nghĩa bảng dữ liệu trong mongoDB
@Schema({
  timestamps: true,
})
export class Tutorial {
  @Prop()
  title: string;
  @Prop()
  author: string;
  @Prop()
  tag: string;
  @Prop()
  view: number;
}

export const TutorialSchema = SchemaFactory.createForClass(Tutorial)
