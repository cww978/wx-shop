import { Module } from '@nestjs/common'
import { WxController } from './wx.controller'
import { WxUser } from './wx_user.entity'
import { WxAccessToken } from './wx_access_token.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WxService } from './wx.service'
import { CacheService } from 'src/cache/cache.service'

@Module({
  imports: [TypeOrmModule.forFeature([WxUser, WxAccessToken])],
  controllers: [WxController],
  providers: [WxService, CacheService],
  exports: [WxService]
})
export class WxModule {}
