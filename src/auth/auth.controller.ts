import { Controller, Get, Req, Post, Body, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { Role } from 'src/post/decorators/role.decorator';
import { Roles } from 'src/post/guards/role.enum';
import { RoleGuard } from 'src/post/guards/role.guard';
import { AuthService } from './auth.service';
import { AccessTokenAuthGuard } from '../guards/access-token.guard';
import { RefreshTokenAuthGuard } from '../guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @UseGuards(AccessTokenAuthGuard, RoleGuard)
  @Role(Roles.User)
  @Get('/logout')
  async logout(@Req() req: Request) {
    await this.auth.logout(req.user['sub']);
  }

  @Post('/login')
  async login(@Body() data: { username: string; password: string }) {
    return await this.auth.login(data.username, data.password);
  }

  @Post('/register')
  async register(@Body() data: Prisma.UserCreateInput) {
    console.log(data.password, data.username);
    return await this.auth.register(data.username, data.password);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get('/refresh')
  async refresh(@Req() req: Request) {
    console.log(req.user);
  }
}
