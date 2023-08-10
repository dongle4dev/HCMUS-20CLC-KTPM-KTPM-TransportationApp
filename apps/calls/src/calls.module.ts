import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [CallsController],
  providers: [CallsService],
})
export class CallsModule {}
