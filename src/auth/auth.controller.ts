import { Controller, Get, Post, Patch, Body, Res, Req, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express"
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private jwtService: JwtService
    ) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
        console.log("1")
    }

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        console.log("2")
        const data = await this.authService.googleLogin(req)
        let token: string
        console.log(data.user)

        if (data.message === 'User information from google') {
            const payload = {
                // userId: data.user.userId,
                nickname: data.user.firstName + data.user.lastName,
                profileImgUrl: data.user.picture,
                googldId: data.user.googleId
            }

            token = await this.jwtService.signAsync(payload)
        }
        console.log(token) 

        res.cookie('token', token, {
            maxAge: 900000,
            sameSite: true, // "none"
            secure: true,
            httpOnly: true,
            domain: "http://localhost:3000", // "www.backend.com"
        });

        return res.send('로그인')
    }

    @Patch('nickname')
    updateNickname(@Body('nickname') nickname: string) {
        return this.authService.updateNickname(nickname);
    }

    @Patch('profileImage')
    @UseInterceptors(FileInterceptor('file'))
    async updateProfileImage(@UploadedFile() file: Express.MulterS3.File) {
        return this.authService.updateProfileImage(file);
    }

    @Get('')
    getUserInfo() {
        return this.authService.getUserInfo();
    }
}
