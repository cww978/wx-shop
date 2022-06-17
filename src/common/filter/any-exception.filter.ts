import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Logger } from '../utils/log4js'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const logFormat = JSON.stringify({
      originalUrl: request.originalUrl,
      method: request.method,
      code: status,
      exception: exception.toString()
    })
    Logger.error(logFormat)
    response.status(status).json({
      statusCode: status,
      msg: `Service Error: ${exception}`
    })
  }
}
