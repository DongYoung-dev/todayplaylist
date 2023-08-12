import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // case 1 token 유효

      const token = req.cookies.token;

      if (token) {
        const user = await this.jwtService.verifyAsync(token, {
          secret: process.env.TOKENKEY,
        });

        res.locals.userId = user.userId;
        res.locals.nickname = user.nickname;
        res.locals.profileImgUrl = user.profileImgUrl;
        res.locals.googleId = user.googleId;
      }

      next();
    } catch (error) {
      console.log(error);
    }
  }
}
