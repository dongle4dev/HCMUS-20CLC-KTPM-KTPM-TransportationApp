import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { TripRepository } from 'y/common/database/trip/repository/trip.repository';
import { Trip, TripSchema } from 'y/common/database/trip/schema/trip.schema';
import { UserJwtStrategy } from './strategies/user.jwt.strategy';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       secret: config.get<string>('JWT_SECRET'),
    //       signOptions: {
    //         expiresIn: config.get<string | number>('JWT_EXPIRES'),
    //       },
    //     };
    //   },
    // }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
  ],
  controllers: [TripController],
  providers: [
    TripService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    TripRepository,
  ],
  exports: [TripService],
})
export class TripModule { }
