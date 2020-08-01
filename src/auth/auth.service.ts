import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(User)
        private userRepository: UserRepository,
    ){}

    async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
        return this.userRepository.signUp(authCredentialDto);
    }
}
