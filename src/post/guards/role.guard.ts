import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Roles } from './role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly db: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowed = this.reflector.getAllAndOverride<Roles[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(allowed);
    const httpCtx = context.switchToHttp().getRequest();
    const id = httpCtx?.params?.id;
    let post: Post;
    if (id) {
      post = await this.db.post.findUnique({ where: { id: +id } });
    }
    console.log(httpCtx?.user?.sub);

    return (
      allowed.some((role) => httpCtx?.user?.role === role) ||
      +httpCtx?.user?.sub === post?.userId
    );
  }
}
