import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { DemandModule } from 'apps/demand/src/demand.module';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import {
  DEMAND_SERVICE,
  MESSAGE_SERVICE,
  TRIP_SERVICE,
} from 'y/common/constants/services';
import { CustomersRepository } from 'y/common/database/customer/repository/customers.repository';
import { CustomerSchema } from 'y/common/database/customer/schema/customer.schema';
import { RmqModule } from 'y/common/rmq/rmq.module';
import { CustomersController } from './customers.controller';
import { CustomersServiceFacade } from './customers.facade.service';
import { CustomersService } from './customers.service';
import { CustomerJwtStrategy } from './strategies/customer.jwt.strategy';
import * as Joi from 'joi';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_HOTLINE_QUEUE: Joi.string().required(),
      }),
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
    ScheduleModule.forRoot(),
    RmqModule,
    HttpModule,
    RmqModule.register({
      name: TRIP_SERVICE,
    }),
    RmqModule.register({
      name: DEMAND_SERVICE,
    }),
    RmqModule.register({
      name: MESSAGE_SERVICE,
    }),
  ],
  controllers: [CustomersController],
  providers: [
    CustomersService,
    CustomersServiceFacade,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    CustomerJwtStrategy,
    CustomersRepository,
  ],
  exports: [
    CustomerJwtStrategy,
    PassportModule,
    CustomersRepository,
    CustomersServiceFacade,
  ],
})
export class CustomersModule {}
