import { Module, CacheModule, Global } from '@nestjs/common'
import * as redisStore from 'cache-manager-redis-store'
import redisConfig from 'src/config/redis.config'

@Global()
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: redisConfig.host,
      port: redisConfig.port,
      auth_pass: redisConfig.password,
      db: 1
    })
  ]
})
export class CachingModule {}
