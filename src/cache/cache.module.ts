import { Module, Global } from '@nestjs/common'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { CacheService } from './cache.service'
import redisConfig from 'src/config/redis.config'

@Global()
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
