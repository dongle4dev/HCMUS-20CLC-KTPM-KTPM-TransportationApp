import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BankaccountsController } from './bankaccounts.controller';
import { BankaccountsService } from './bankaccounts.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [BankaccountsController],
  providers: [BankaccountsService],
})
export class BankaccountsModule {}
