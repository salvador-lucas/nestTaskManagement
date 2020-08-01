import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class AuthCredentialDto {
    @IsString()
    @MinLength(4)
    @MaxLength(15)
    username: string;

    @IsString()
    @MinLength(6)
    @MaxLength(15)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
     {message: "password too weak, come on!"}
    )
    password: string;
}