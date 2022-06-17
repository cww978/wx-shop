import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthLoginOption } from './auth.interface'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: AuthLoginOption) {
    const payload = {
      userid: user.userId,
      username: user.name
    }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
