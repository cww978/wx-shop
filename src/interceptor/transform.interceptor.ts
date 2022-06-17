import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Logger } from 'src/common/utils/log4js'
import serverConfig from 'src/config/server.config'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req
    return next.handle().pipe(
      map((data) => {
        const logFormat = JSON.stringify({
          originalUrl: req.originalUrl,
          method: req.method,
          ip: req.ip,
          user: req.user,
          request: req.body
        })
        if (serverConfig.logger && serverConfig.logger.includes('info')) {
          Logger.info(logFormat)
          Logger.access(logFormat)
        }
        return data
      })
    )
  }
}
