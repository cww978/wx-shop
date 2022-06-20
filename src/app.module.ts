import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_GUARD } from '@nestjs/core'

import { JwtAuthGuard } from './common/guards/auth.guard'
import { WxModule } from './wx/wx.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { CachingModule } from './caching/caching.module'
import { RecheModule } from './reche/reche.module'
import databaseConfig from './config/database.config'

@Module({
  imports: [
    RecheModule,
    CachingModule,
    AuthModule,
    TypeOrmModule.forRoot(databaseConfig),
    WxModule,
    UserModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
