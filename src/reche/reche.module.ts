import { Module, Global } from '@nestjs/common'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { RecheService } from './reche.service'
import redisConfig from 'src/config/redis.config'

@Global()
@Module({
  imports: [
    RedisModule.forRoot({
      config: redisConfig
    })
  ],
  providers: [RecheService],
  exports: [RecheService]
})
export class RecheModule {}
