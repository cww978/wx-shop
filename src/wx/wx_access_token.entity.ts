import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('wx_access_token')
export class WxAccessToken {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 28
  })
  openid: string

  @Column()
  access_token: string

  @Column()
  refresh_token: string

  @Column()
  expires_time: Date

  @CreateDateColumn()
  create_time: Date

  @UpdateDateColumn()
  update_time: Date

  static getKeys() {
    return ['openid', 'access_token', 'refresh_token', 'expires_in']
  }
}
