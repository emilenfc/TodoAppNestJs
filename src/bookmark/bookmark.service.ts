import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { json } from 'stream/consumers';

@Injectable()
export class BookmarkService {
    constructor(private prisma:PrismaService){}

    getBookmarks(userId: number
    ) {
        return this.prisma.bookmark.findMany({
            where: {
                userId,
            }
        })
    }

   async createBookmark(
    userId: number,
    dto: CreateBookmarkDto
) {
    const bookmark = await this.prisma.bookmark.create({
        data: {
            userId,
            ...dto,
        },
    });

    return bookmark;
}

       getBookmarkById(
        userId: number,
        bookmarkId: number
       ) {
         return this.prisma.bookmark.findFirst({
             where: {
                 id:bookmarkId,
                 userId,
            }
        })
     }
    
    async editBookmarkById(
        userId: number,
        bookmarkId: number,
        dto: EditBookmarkDto
    ) {
        //get the bookmarks by id
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id:bookmarkId
            }
        })
        if (!bookmark || bookmark.userId !== userId)
            throw new ForbiddenException('Acces to tis bookmarks is denied');
        
        return this.prisma.bookmark.update({
            where: {
                id:bookmarkId
            },
            data: {
                ...dto, 
            }
        })
     }
    
    async deleteBookmarkById(
        userId: number,
        bookmarkId: number
    ) {
         //get the bookmarks by id
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id:bookmarkId
            }
        })
        if (!bookmark || bookmark.userId !== userId)
            throw new ForbiddenException('Acces to tis bookmarks is denied');
        
        await this.prisma.bookmark.delete({
            where: {
                id: bookmarkId
            },
         
        });
        return "deleted"
     }
}
