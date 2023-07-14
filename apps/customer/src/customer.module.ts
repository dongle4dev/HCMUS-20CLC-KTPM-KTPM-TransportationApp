import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerInterceptor } from './interceptors/customer.interceptor';
import { CustomerSchema } from './schema/customer.schema';
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
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomerInterceptor,
    },
    CustomerJwtStrategy,
  ],
  exports: [CustomerJwtStrategy, PassportModule],
})
export class CustomerModule {}
