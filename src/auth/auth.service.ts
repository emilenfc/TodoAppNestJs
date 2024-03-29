import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2' 
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigObject, ConfigService } from "@nestjs/config";
@Injectable()
export class AuthService{ 
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config:ConfigService

    ) { }

    async signup(dto:AuthDto) {
        
        // generate the password hash using argon2
        const hash = await argon.hash(dto.password)
        try {
            
            //save the new user in db

         const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash
            },
             
        });
        delete user.hash// for returning only selected information

        //return the saved user
        return user
        }
        catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            throw new ForbiddenException(
                'Credentials taken'
            );
        }
    }
    throw error

}
       
 }


    async signin(dto: AuthDto) { 
        // find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email:dto.email
            }
        })
        // if user doesn't exist throw error
        if (!user)
            throw new ForbiddenException(
                'incorect cresidentials'
            )
        //compare password
        const psMatches = await argon.verify(
            user.hash,
            dto.password
        )
        //if incorrect throw error
        if (!psMatches)
            throw new ForbiddenException(
                'incorect password'
            )
          
        //send back user
        return  this.signToken(user.id, user.email) ;
    }
    
    async signToken(userId: number, email: string):Promise<{acces_token:string}> {
        const payload = {
            sub: userId,
            email
        }
        
        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn: '15h',
                secret: secret
            });
        return {
            acces_token:token,
        }
    }
}