import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(config:ConfigService) {
        super({
            datasources: {
                db: {
                    url:config.get('DATABASE_URL'),
                }
            }
        })
    }
    cleanDB() {
        return this.$transaction([
        this.bookmark.deleteMany(),
        this.user.deleteMany(),
        ])
    }
}
