import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
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
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.auth.logout(req.user['sub']);
    return res.clearCookie('refresh-token').send({
      message: 'Successfully logged out',
    });
  }

  @Post('/login')
  async login(
    @Body() data: { username: string; password: string },
    @Res() res: Response,
  ) {
    const { refreshToken, accessToken } = await this.auth.login(
      data.username,
      data.password,
    );
    // res
    //   .cookie('access-token', accessToken, {
    //     httpOnly: true,
    //     secure: true,
    //   })
    //   .json({ refreshToken, accessToken });
    res.cookie('refresh-token', refreshToken, {
      expires: new Date(new Date().getTime() + 30 * 1000),
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
    return res.send({
      refreshToken,
      accessToken,
    });
  }

  @Post('/register')
  async register(@Body() data: Prisma.UserCreateInput) {
    console.log(data.password, data.username);
    return await this.auth.register(data.username, data.password);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const uid = req.user['sub'];
    const _refreshToken = req.user['refreshToken'];
    const { accessToken, refreshToken } = await this.auth.genRefreshToken(
      uid,
      _refreshToken,
    );
    res
      .cookie('refresh-token', refreshToken, {
        expires: new Date(new Date().getTime() + 30 * 1000),
        sameSite: 'none',
        httpOnly: true,
      })
      .json({
        accessToken,
        refreshToken,
      });
  }
}
