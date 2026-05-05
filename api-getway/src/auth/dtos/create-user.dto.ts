/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsString, Matches,  MinLength } from "class-validator";


export class CreateUserDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email!: string


    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
        'Password must contain at least one letter and one number',
    })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        {
        message:
            'Password must contain uppercase, lowercase, number and special character',
        },
    )
    @MinLength(8)
    password!:string

}