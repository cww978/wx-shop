import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as express from 'express'
import serverConfig from './config/server.config'
import { LoggerMiddleware } from './middleware/logger.middleware'
import { TransformInterceptor } from './interceptor/transform.interceptor'
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter'
import { AllExceptionsFilter } from 'src/common/filter/any-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {})
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(LoggerMiddleware)
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(serverConfig.port)
}
bootstrap()
