import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decerator';
import { User } from '@prisma/client';
import { EditUserDto } from '.';
import { UserService } from './user.service';

//I will user guards here to protect some rootes to not being accessble without logedin

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService:UserService){}

    @Get('me')
    getme(@GetUser   () user:User) {
        return user 
    }

    @Patch()
        
    editUser(
        @GetUser('id') userId: number,
        @Body() dto:EditUserDto,
    ) { 
     return this.userService.editUser(userId,dto)
    }
    
}
