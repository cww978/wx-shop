import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthLoginOption } from './auth.interface'
import jwtConfig from 'src/config/jwt.config'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async login(user: AuthLoginOption) {
    const payload = {
      userid: user.userId,
      username: user.name
    }
    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.expiresIn
      })
    }
  }
}
