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
import { TripModule } from 'apps/trips/src/trip.module';
import { RmqModule } from 'y/common/rmq/rmq.module';
import {
  LOCATION_SERVICE,
  TRACKING_SERVICE,
} from 'y/common/constants/services';
import { TripRepository } from 'y/common/database/trip/repository/trip.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/hotlines/.env',
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
    // DemandModule,
    TripModule,
    RmqModule.register({
      name: LOCATION_SERVICE,
    }),
    RmqModule.register({
      name: TRACKING_SERVICE,
    }),
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
