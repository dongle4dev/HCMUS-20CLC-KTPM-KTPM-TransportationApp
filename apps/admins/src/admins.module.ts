import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserInterceptor } from 'y/common/auth/user.interceptor';
import { AdminsRepository } from 'y/common/database/admin/repository/admins.repository';
import { AdminSchema } from 'y/common/database/admin/schema/admin.schema';
import { CustomersRepository } from 'y/common/database/customer/repository/customers.repository';
import { CustomerSchema } from 'y/common/database/customer/schema/customer.schema';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import { DriverSchema } from 'y/common/database/driver/schema/driver.schema';
import { AdminsController } from './admins.controller';
import { AdminsServiceFacade } from './admins.facade.service';
import { AdminsService } from './admins.service';
import { AdminJwtStrategy } from './strategies/admin.jwt.strategy';

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
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: 'Driver', schema: DriverSchema }]),
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
  ],
  controllers: [AdminsController],
  providers: [
    AdminsService,
    AdminsServiceFacade,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    AdminJwtStrategy,
    AdminsRepository,
    CustomersRepository,
    DriversRepository,
  ],
  exports: [AdminJwtStrategy, PassportModule],
})
export class AdminsModule {}
