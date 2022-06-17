import { Controller, Get, Query, Request } from '@nestjs/common'
import { WxService } from './wx.service'
import { AuthService } from 'src/auth/auth.service'
import { Public } from 'src/common/decorator/public.decorator'

@Controller('wx')
export class WxController {
  constructor(private wxService: WxService, private authService: AuthService) {}

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

  @Public()
  @Get('/get_token')
  async getToken(): Promise<any> {
    const token = await this.authService.login({
      userId: 'ofhN951RnXIxqx_if3m7pjeEjuSk',
      name: 'Caowenw'
    })
    return token
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
