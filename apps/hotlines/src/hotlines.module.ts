import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { DemandModule } from 'apps/demand/src/demand.module';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { HotlinesRepository } from 'y/common/database/hotline/repository/hotlines.repository';
import {
  Hotline,
  HotlineSchema,
} from 'y/common/database/hotline/schema/hotline.schema';
import { HotlinesController } from './hotlines.controller';
import { HotlinesServiceFacade } from './hotlines.facade.service';
import { HotlinesService } from './hotlines.service';
import { HotlineJwtStrategy } from './strategies/hotline.jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),

    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([{ name: Hotline.name, schema: HotlineSchema }]),
    DemandModule,
  ],
  controllers: [HotlinesController],
  providers: [
    HotlinesService,
    HotlinesServiceFacade,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    HotlineJwtStrategy,
    HotlinesRepository,
  ],
  exports: [HotlineJwtStrategy, PassportModule, HotlinesRepository],
})
export class HotlinesModule {}
