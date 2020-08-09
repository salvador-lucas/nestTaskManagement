import { Repository, EntityRepository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
        const {username, password} = authCredentialsDto;
        const user = new User();
        
        user.salt = await bcrypt.genSalt();
        user.username = username;
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
        } catch(e) {
            if (e.code === '23505') {
                throw new ConflictException('Username already exists')
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialDto): Promise<string>{
        const {username, password} = authCredentialsDto;
        const user = await this.findOne({username});

        if (user)  {
            const validPassword = await user.validatePassword(password);
            if (validPassword)
                return user.username;
            return null;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}