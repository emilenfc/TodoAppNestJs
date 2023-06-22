import { Optional } from "@nestjs/common"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateBookmarkDto{
    @IsString()
        @IsNotEmpty()
    title: string

    @IsString()
    @Optional()
    description?: string

    @IsString()
        @IsNotEmpty()
    link:string
}