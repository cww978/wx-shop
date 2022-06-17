import { Request, Response } from 'express'
import { Logger } from '../common/utils/log4js'

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
    Logger.access(logFormat)
  }
  next()
}
