import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { User } from './domain/user';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('')
    async makeUser(@Body() user: User, @Res() res: Response) {

        try {
            console.log('con1')
            await this.authService.makeUser(user)
            console.log('con2')
            res.status(200).json({
                message: 'Success'
            })
        } catch (err) {
            console.log(err)
        }
    }
}
