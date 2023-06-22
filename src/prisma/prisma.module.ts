import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //to make this module availble in all other modules so that it will not be neccessary to import it every time
@Module({
  providers: [PrismaService],
  exports :[PrismaService]
})
export class PrismaModule {}
