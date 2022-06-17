import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_GUARD } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'

import { JwtAuthGuard } from './common/guards/auth.guard'
import { WxModule } from './wx/wx.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { CacheModule } from './cache/cache.module'
import databaseConfig from './config/database.config'

@Module({
  imports: [
    CacheModule,
    TypeOrmModule.forRoot(databaseConfig),
    WxModule,
    AuthModule,
    UserModule
  ],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
