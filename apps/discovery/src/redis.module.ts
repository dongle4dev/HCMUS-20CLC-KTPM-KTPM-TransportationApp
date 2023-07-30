import { Module } from '@nestjs/common';
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT', // Unique identifier for the Redis client
      useFactory: () => {
        // Create and return the Redis client
        return new Redis({
          host: 'redis-server', // Replace with the appropriate Redis host
          port: 6379, // Replace with the appropriate Redis port
          // Add any other Redis client options here if needed
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'], // Make the Redis client available for other modules
})
export class RedisModuleClass {}
