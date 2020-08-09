import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(User)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ){}

    async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
        return this.userRepository.signUp(authCredentialDto);
    }

    async singIn(authCredentialDto: AuthCredentialDto):Promise<{accessToken: string}> {
        const username = await this.userRepository.validateUserPassword(authCredentialDto);
        if (!username) {
            throw new UnauthorizedException('Invalid Credentials');
        }
        const payload: JwtPayload = {username};
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
}
