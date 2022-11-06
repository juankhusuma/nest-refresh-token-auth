import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenAuthGuard } from 'src/guards/access-token.guard';
import { Role } from './decorators/role.decorator';
import { Roles } from './guards/role.enum';
import { RoleGuard } from './guards/role.guard';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly post: PostService) {}

  @Role(Roles.Admin, Roles.User)
  @UseGuards(AccessTokenAuthGuard, RoleGuard)
  @Get('')
  async getAll() {
    return await this.post.all();
  }

  @Role(Roles.Admin)
  @UseGuards(AccessTokenAuthGuard, RoleGuard)
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
