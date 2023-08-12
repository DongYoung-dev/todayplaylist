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

  async checkAndRegisterUser(data) {
    const thisUser = await this.userRepository.findOne({
      where: { googleId: data.id },
    });

    if (!thisUser) {
      const userData = {
        nickname: data.family_name + data.given_name,
        profileImgUrl: data.picture,
        googleId: data.id,
      };

      const registeredUser = await this.userRepository.save(userData);

      return registeredUser;
    }

    return thisUser;
  }

  async updateNickname(nickname: string) {
    const userId = '1';

    await this.userRepository.update(userId, { nickname: nickname });

    return { message: 'Success' };
  }

  async updateProfileImage(file: Express.MulterS3.File) {
    const userId = '1';

    if (!file) {
      throw new BadRequestException('파일이 존재하지 않습니다.');
    }

    await this.userRepository.update(userId, { profileImgUrl: file.location });

    return { message: 'Success' };
  }

  async getUserInfo(userId: string) {
    console.log(userId);

    return await this.userRepository.findOne({ where: { userId: userId } });
  }
}
