import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { AdminSchema } from 'y/common/database/admin/schema/admin.schema';
import { CustomerSchema } from 'y/common/database/customer/schema/customer.schema';
import { DriverSchema } from 'y/common/database/driver/schema/driver.schema';
import { HotlineSchema } from 'y/common/database/hotline/schema/hotline.schema';
import { TripRepository } from 'y/common/database/trip/repository/trip.repository';
import { TripSchema } from 'y/common/database/trip/schema/trip.schema';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { UserJwtStrategy } from './strategies/user.jwt.strategy';

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
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
    MongooseModule.forFeature([{ name: 'Trip', schema: TripSchema }]),
    MongooseModule.forFeature([{ name: 'Driver', schema: DriverSchema }]),
    MongooseModule.forFeature([{ name: 'Hotline', schema: HotlineSchema }]),
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
  ],
  controllers: [TripController],
  providers: [
    TripService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    UserJwtStrategy,
    TripRepository,
  ],
  exports: [TripService, PassportModule, UserJwtStrategy],
})
export class TripModule {}
