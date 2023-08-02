import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { CustomersRepository } from 'y/common/database/customer/repository/customers.repository';
import { CustomerSchema } from 'y/common/database/customer/schema/customer.schema';
import { CustomersController } from './customers.controller';
import { CustomersServiceFacade } from './customers.facade.service';
import { CustomersService } from './customers.service';
import { CustomerJwtStrategy } from './strategies/customer.jwt.strategy';

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
  exports: [CustomerJwtStrategy, PassportModule, CustomersRepository],
})
export class CustomersModule {}
