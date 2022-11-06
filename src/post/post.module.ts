import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoleGuard } from './guards/role.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [PrismaModule],
  providers: [PostService, RoleGuard],
  controllers: [PostController],
})
export class PostModule {}
