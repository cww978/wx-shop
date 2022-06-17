import { Request, Response } from 'express'
import { Logger } from '../common/utils/log4js'
import serverConfig from 'src/config/server.config'

export function LoggerMiddleware(
  req: Request,
  res: Response,
  next: () => void
) {
  const code = res.statusCode
  const logFormat = JSON.stringify({
    method: req.method,
    originalUrl: req.originalUrl,
    ip: req.ip,
    code: code
  })
  if (code >= 500) {
    Logger.error(logFormat)
  } else if (code >= 400) {
    Logger.warn(logFormat)
  } else {
    if (
      Array.isArray(serverConfig.logger) &&
      serverConfig.logger.includes('info')
    ) {
      Logger.info(logFormat)
      Logger.access(logFormat)
    }
  }
  next()
}
