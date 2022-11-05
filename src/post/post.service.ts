import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(protected readonly db: PrismaService) {}

  async create(data: Prisma.PostCreateInput) {
    return await this.db.post.create({ data });
  }
  async all() {
    return await this.db.post.findMany();
  }
  async get(where: Prisma.PostWhereUniqueInput) {
    return await this.db.post.findUnique({ where });
  }
  async update(
    where: Prisma.PostWhereUniqueInput,
    data: Prisma.PostUpdateInput,
  ) {
    return await this.db.post.update({ where, data });
  }
  async delete(where: Prisma.PostWhereUniqueInput) {
    return await this.db.post.delete({ where });
  }
}
