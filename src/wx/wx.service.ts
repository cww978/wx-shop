import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import axios from 'axios'
import stringRandom = require('string-random')
import { CacheService } from '../cache/cache.service'
import { AuthService } from '../auth/auth.service'
import wxConfig from 'src/config/wx.config'
import { WxAccessTokenRes, WxUserInfoRes, WxConfigRes } from './wx.interface'
import { WxAccessToken } from './wx_access_token.entity'
import { WxUser } from './wx_user.entity'
import { sha1, copyValueToParams, getExpiresTime } from '../utils/index'

@Injectable()
export class WxService {
  constructor(
    private cacheService: CacheService,

    private authService: AuthService,

    @InjectRepository(WxUser)
    private userModel: Repository<WxUser>,

    @InjectRepository(WxAccessToken)
    private accessTokenModel: Repository<WxAccessToken>
  ) {}

  async wxLogin(code: string) {
    const access: WxAccessTokenRes = await this.getAccessTokenForCode(code)
    const user: WxUserInfoRes = await this.updateWxUserInfo(
      access?.access_token,
      access?.openid
    )
    if (user) {
      const token = await this.authService.login({
        userId: user.openid,
        name: user.nickname
      })
      return token
    } else {
      return null
    }
  }

  async wxSignature(openid: string, url: string): Promise<WxConfigRes> {
    const jsapiTicket = await this.getJsTicket(openid)
    const config: WxConfigRes = {
      appid: wxConfig.appid,
      noncestr: stringRandom(16),
      timestamp: Date.now().valueOf(),
      signature: null
    }
    if (jsapiTicket) {
      const ticket = 'jsapi_ticket=' + jsapiTicket
      const timestamp = 'timestamp=' + config.timestamp
      const link = 'url=' + url
      const noncestr = 'noncestr=' + config.noncestr
      const string1 = `${ticket}&${noncestr}&${timestamp}&${link}`
      config.signature = sha1(string1)
    }
    return config
  }

  async getJsTicket(openid: string) {
    const key = 'jsticket-' + openid
    const ticket = await this.cacheService.get(key)
    if (ticket) {
      return ticket
    } else {
      const access_token = await this.getGlobalAccessToken()
      const { data } = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`
      )
      if (data.errcode === 0) {
        this.cacheService.set(key, data.ticket, data.expires_in)
        return data.ticket
      } else {
        return null
      }
    }
  }

  async getGlobalAccessToken() {
    const key = 'global-access-token'
    const { appid, appsecret } = wxConfig
    const token = await this.cacheService.get(key)
    if (token) {
      return token
    } else {
      const { data } = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`
      )
      if (Object.hasOwnProperty.call(data, 'access_token')) {
        this.cacheService.set(key, data.access_token, data.expires_in)
        return data.access_token
      } else {
        return null
      }
    }
  }

  async getAccessTokenForCode(code: string): Promise<WxAccessTokenRes> {
    const { appid, appsecret } = wxConfig

    const { data } = await axios.get(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${code}&grant_type=authorization_code`
    )

    if (Object.hasOwnProperty.call(data, 'access_token')) {
      const access = await this.accessTokenModel.findOne({
        where: { openid: data.openid }
      })
      const accessParam = copyValueToParams<WxAccessToken>(
        data,
        access || new WxAccessToken(),
        WxAccessToken.getKeys()
      )
      accessParam.expires_time = new Date(getExpiresTime(data.expires_in))
      await this.accessTokenModel.save(accessParam)
      return data
    } else {
      return null
    }
  }

  async getUserInfo(openid: string): Promise<WxUser> {
    return await this.userModel.findOne({
      where: { openid: openid }
    })
  }

  async updateWxUserInfo(
    token: string,
    openid: string
  ): Promise<WxUserInfoRes> {
    const { data } = await axios.get(
      `https://api.weixin.qq.com/sns/userinfo?access_token=${token}&openid=${openid}&lang=zh_CN`
    )
    if (Object.hasOwnProperty.call(data, 'openid')) {
      const user = await this.userModel.findOne({
        where: { openid: data.openid }
      })

      const userParam = copyValueToParams<WxUser>(
        data,
        user || new WxUser(),
        WxUser.getKeys()
      )

      this.userModel.save(userParam)
      return data
    } else {
      return null
    }
  }
}
