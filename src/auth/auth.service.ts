import { Injectable } from '@nestjs/common';
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

    async makeUser(user: User): Promise<void> {
        try {
            console.log(user)
            console.log("ser1")
            await this.userRepository.save(user)
            console.log("ser2")
        } catch (err) {
            console.log('ser.err.1')
            console.log(err)
        }
    }

}
