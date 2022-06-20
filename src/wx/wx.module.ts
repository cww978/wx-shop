import { Module, CacheModule } from '@nestjs/common'
import { WxController } from './wx.controller'
import { WxUser } from './wx_user.entity'
import { WxAccessToken } from './wx_access_token.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WxService } from './wx.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([WxUser, WxAccessToken]),
    CacheModule.register()
  ],
  controllers: [WxController],
  providers: [WxService],
  exports: [WxService]
})
export class WxModule {}
