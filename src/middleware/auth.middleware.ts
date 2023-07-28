import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

const COOKIE_OPTIONS = {
    domain: '.duoduo.lol',
    secure: true,
    httpOnly: true,
    sameSite: 'none',
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor (

        private jwtService: JwtService
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            // case 1 token 유효

            const token = req.cookies.token
            console.log('*'+ token)
            const user = await this.jwtService.verifyAsync(
                token,
                {
                    secret: process.env.TOKENKEY
                }
            )

            // const currentUser = await User.findOne({ _id: user.userId })

            res.locals.userId = user.userId
            res.locals.nickname = user.nickname
            res.locals.profileImgUrl = user.profileImgUrl
            res.locals.googleId = user.googleId

            next()
        } catch (error) {
            try {
                // if (error.name === 'TokenExpiredError') {
                //     // case 2 token 만료, refreshToken 유효
                //     const refreshToken = req.cookies.refreshToken
                //     const user = jwt.verify(refreshToken, process.env.TOKENKEY)

                //     const dbRefresh = await RefreshToken.findOne({
                //         userId: user.userId,
                //     })

                //     if (refreshToken !== dbRefresh.refreshToken)
                //         return res.status(401).json({
                //             message: '다시 로그인해주세요.',
                //             reason: 'database에 저장된 refreshToken과 다릅니다.',
                //         })

                //     const newToken = jwt.sign(
                //         { userId: user.userId },
                //         process.env.TOKENKEY,
                //         { expiresIn: process.env.VALID_ACCESS_TOKEN_TIME }
                //     )

                //     res.cookie('token', newToken, COOKIE_OPTIONS)

                //     const currentUser = await User.findOne({ _id: user.userId })

                //     res.locals.userId = currentUser.userId
                //     res.locals.nickname = currentUser.nickname
                //     res.locals.profileImgUrl = currentUser.profileImgUrl
                //     res.locals.googleId = currentUser.googleId

                //     next()
                // } else {
                //     console.log(error)
                //     return res.status(401).json({
                //         message: '다시 로그인해주세요.',
                //         reason: 'token에 문제가 있습니다.',
                //     })
                // }
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        message: '다시 로그인해주세요.',
                        reason: 'refreshToken이 만료되었습니다.',
                    })
                } else {
                    console.log(error)
                    return res.status(401).json({
                        message: '다시 로그인해주세요.',
                        reason: 'refreshToken에 문제가 있습니다.',
                    })
                }
            }
        }
    }
}