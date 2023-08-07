import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import {
  Driver,
  DriverSchema,
} from 'y/common/database/driver/schema/driver.schema';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DriversServiceFacade } from './drivers.facade.service';
import { DriverJwtStrategy } from './strategies/driver.jwt.strategy';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
  ],
  controllers: [DriversController],
  providers: [
    DriversService,
    DriversServiceFacade,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    DriverJwtStrategy,
    DriversRepository,
  ],
  exports: [DriverJwtStrategy, PassportModule, DriversRepository],
})
export class DriversModule {}
