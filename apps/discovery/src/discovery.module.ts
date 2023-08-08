import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { SupplyModule } from 'apps/supply/src/supply.module';
import { DiscoveryRepository } from 'y/common/database/discovery/repository/discovery.repository';
import { DiscoverySchema } from 'y/common/database/discovery/schema/discovery.schema';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';

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
    MongooseModule.forFeature([{ name: 'Discovery', schema: DiscoverySchema }]),
    SupplyModule,
  ],
  controllers: [DiscoveryController],
  providers: [
    DiscoveryService,
    DiscoveryRepository,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
    // {
    //   provide: 'Redis', // Use the same identifier as in the RedisModule
    //   useExisting: 'REDIS_CLIENT', // Reference the Redis client provider from RedisModule
    // },
  ],
})
export class DiscoveryModule {}
