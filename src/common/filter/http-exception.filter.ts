import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException
} from '@nestjs/common'
import { Request, Response } from 'express'
import { Logger } from '../utils/log4js'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    const logFormat = JSON.stringify({
      originalUrl: request.originalUrl,
      method: request.method,
      code: status,
      exception: exception.toString()
    })
    Logger.error(logFormat)
    response.status(status).json({
      statusCode: status,
      error: exception.message,
      msg: `${status >= 500 ? 'Service Error' : 'Client Error'}`
    })
  }
}
