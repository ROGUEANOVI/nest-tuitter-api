import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConstanst } from './jwt.constanst';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JwtConstanst.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.id,
      username: payload.username,
      role: payload.role,
    };
  }
}
