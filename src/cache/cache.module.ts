import { Module } from '@nestjs/common'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { CacheService } from './cache.service'
import redisConfig from 'src/config/redis.config'

@Module({
  imports: [
    RedisModule.forRoot({
      config: redisConfig
    })
  ],
  providers: [CacheService],
  exports: [CacheService]
})
export class CacheModule {}
