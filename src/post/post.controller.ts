import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AccessTokenAuthGuard } from 'src/auth/guards/access-token.guard';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly post: PostService) {}

  @UseGuards(AccessTokenAuthGuard)
  @Get('')
  async getAll() {
    return await this.post.all();
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    return await this.post.get({ id: +id });
  }

  @Post('')
  async create(@Body() data: Prisma.PostCreateInput) {
    return await this.post.create(data);
  }

  @Put('/:id')
  async update(@Param('id') id: string, data: Prisma.PostUpdateInput) {
    return await this.post.update({ id: +id }, data);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.post.delete({ id: +id });
  }
}
