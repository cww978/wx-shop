import { Controller, Get, Query, Request } from '@nestjs/common'
import { WxService } from './wx.service'
import { Public } from 'src/common/decorator/public.decorator'

@Controller('wx')
export class WxController {
  constructor(private wxService: WxService) {}

  @Public()
  @Get('/login')
  async login(@Query('code') code: string): Promise<any> {
    const data = await this.wxService.wxLogin(code)
    return {
      code: data ? 0 : -1,
      data,
      message: 'success'
    }
  }

  @Get('/signature')
  async signature(@Query('url') url: string, @Request() req): Promise<any> {
    const data = await this.wxService.wxSignature(req.user.userid, url)
    return {
      code: data ? 0 : -1,
      data,
      message: 'success'
    }
  }

  @Get('/get_user')
  async getUserInfo(@Request() req): Promise<any> {
    const data = await this.wxService.getUserInfo(req.user.userid)
    return {
      code: data ? 0 : -1,
      data,
      message: 'success'
    }
  }
}
