import { Injectable } from '@nestjs/common'
import { RedisService } from '@liaoliaots/nestjs-redis'

@Injectable()
export class RecheService {
  public client
  constructor(private redisService: RedisService) {
    this.getClient()
  }
  async getClient() {
    this.client = await this.redisService.getClient()
  }

  /**
   * @Description: 封装设置redis缓存的方法
   * @param key {String} key值
   * @param value {String} key的值
   * @param seconds {Number} 过期时间 秒秒秒！！！
   * @return: Promise<any>
   */
  //设置值的方法
  public async set(key: string, value: any, seconds?: number) {
    value = JSON.stringify(value)
    if (!this.client) {
      await this.getClient()
    }
    if (!seconds) {
      await this.client.set(key, value)
    } else {
      await this.client.set(key, value, 'EX', seconds)
    }
  }

  //获取值的方法
  public async get(key: string) {
    if (!this.client) {
      await this.getClient()
    }
    const data = await this.client.get(key)
    if (!data) return
    return JSON.parse(data)
  }

  //获取值的方法
  public async del(key: string) {
    if (!this.client) {
      await this.getClient()
    }
    await this.client.del(key)
  }
  // 清理缓存
  public async flushall(): Promise<any> {
    if (!this.client) {
      await this.getClient()
    }

    await this.client.flushall()
  }
}
