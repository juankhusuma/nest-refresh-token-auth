import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.db.user.create({ data });
  }

  async get(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.db.user.findUnique({ where });
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    return await this.db.user.update({ where, data });
  }
}
