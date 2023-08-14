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
import { SupplyModule } from 'apps/supply/src/supply.module';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';
import { RmqModule } from 'y/common/rmq/rmq.module';
import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { SUPPLY_SERVICE } from 'y/common/constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_DRIVER_QUEUE: Joi.string().required(),
      }),
      // envFilePath: './apps/drivers/.env',
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
    SupplyModule,
    ScheduleModule.forRoot(),
    // ClientsModule.register([
    //   {
    //     name: 'RABBIT_MQ',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://guest:guest@localhost:5672'], // RabbitMQ server URI
    //       queue: 'exchange_name', // Replace with your exchange name
    //       queueOptions: { durable: false },
    //     },
    //   },
    // ]),
    RmqModule,
    RmqModule.register({
      name: SUPPLY_SERVICE,
    }),
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
  exports: [
    DriverJwtStrategy,
    PassportModule,
    DriversRepository,
    DriversServiceFacade,
  ],
})
export class DriversModule {}
