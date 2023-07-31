import { Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from 'nestjs-redis';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from '../service/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Đảm bảo bạn đã cài đặt và cấu hình ConfigModule để sử dụng biến môi trường (.env)
    NestRedisModule.register({
      // Cấu hình Redis connection
      url: process.env.REDIS_URL || 'redis://localhost:6379', // Sử dụng biến môi trường hoặc mặc định là localhost và cổng 6379
    }),
  ],
  providers: [RedisService],
  exports: [NestRedisModule, RedisService],
})
export class RedisModule {}
