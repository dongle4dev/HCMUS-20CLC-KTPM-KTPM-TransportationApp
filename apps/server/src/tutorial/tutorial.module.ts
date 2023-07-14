import { Module } from '@nestjs/common';
import { TutorialController } from './tutorial.controller';
import { TutorialService } from './tutorial.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tutorial, TutorialSchema } from './schemas/tutorial.schema';

// set up controller, provider tại đây
@Module({
  // set up model mongodb để sử dụng
  imports: [
    MongooseModule.forFeature([
      { name: Tutorial.name, schema: TutorialSchema },
    ]),
  ],
  controllers: [TutorialController],
  providers: [TutorialService],
})
export class TutorialModule {}
