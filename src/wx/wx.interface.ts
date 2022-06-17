/**
 * @description wx-token
 */
export interface WxAccessTokenRes {
  access_token: string
  expires_in: number
  refresh_token: string
  openid: string
  scope: string
}

/**
 * @description wx-userinfo
 */
export interface WxUserInfoRes {
  openid: string
  sex: number
  nickname: string
  province: string
  city: string
  country: string
  headimgurl: string
}

/**
 * @description wx-config
 */
export interface WxConfigRes {
  appid: string
  timestamp: number
  noncestr: string
  signature: string
}
