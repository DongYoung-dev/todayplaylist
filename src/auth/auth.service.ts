import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './domain/user';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {
        this.userRepository = userRepository;
    }

    async googleLogin(req) {
        if (!req.user) {
            return {
                message: 'No user from google'
            }
        }
        console.log(req.user)
        let exUser = await this.userRepository.findOne({ where: { googleId: req.user.googleId } })

        if (exUser) {
            return {
                message: 'User information from google',
                user: req.user
            }
        } else {
            const user = {
                nickname: req.user.firstName + req.user.lastName,
                profileImgUrl: req.user.picture,
                googleId: req.user.googleId
            }

            try {
                await this.userRepository.save(user)
            } catch (err) {
                console.log(err)
            }
        }

        console.log('3')

        return {
            message: 'User information from google',
            user: req.user
        }
    }

    async updateNickname(nickname: string) {
        const userId = '1'

        await this.userRepository.update(userId, { nickname: nickname })

        return { message: "Success" };
    }

    async updateProfileImage(file: Express.MulterS3.File) {
        const userId = '1'

        if (!file) {
            throw new BadRequestException('파일이 존재하지 않습니다.');
        }

        await this.userRepository.update(userId, { profileImgUrl: file.location })

        return { message: "Success" };
    }

    async getUserInfo() {
        const userId = '1'

        return await this.userRepository.findOne( { where: { userId: userId } } )
    }

}
