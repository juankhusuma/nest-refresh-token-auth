import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserService,
    private readonly jwt: JwtService,
  ) {}

  async register(username: string, password: string) {
    const user = await this.user.get({ username });
    if (user) {
      throw new BadRequestException('Username already exists');
    }
    const hashed_password = await hash(password, 12);
    const _user = await this.user.create({
      username,
      password: hashed_password,
    });
    const { refreshToken } = await this.token(
      _user.id.toString(),
      _user.username,
      'user',
    );
    await this.user.update({ username }, { token: refreshToken });
    return refreshToken;
  }

  private async validate(
    username: string,
    password: string,
  ): Promise<{ id: number; username: string }> {
    const user = await this.user.get({ username });
    if (compare(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  private async token(uid: string, username: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: uid,
          username,
          role,
        },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwt.signAsync(
        { sub: uid, username },
        { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async refresh(uid: string, refreshToken: string) {
    const hasedToken = await hash(refreshToken, 12);
    await this.user.update({ id: +uid }, { token: hasedToken });
  }

  async genRefreshToken(uid: string, refreshToken: string) {
    const user = await this.user.get({ id: +uid });
    if (await compare(refreshToken, user.token)) {
      const tokens = await this.token(uid, user.username, user.role);
      await this.refresh(user.id.toString(), tokens.refreshToken);
      return tokens;
    }
    return null;
  }

  async login(username: string, password: string) {
    const data: any = await this.validate(username, password);
    const tokens = await this.token(
      data.id.toString(),
      data.username,
      data.role,
    );
    await this.refresh(data.id.toString(), tokens.refreshToken);
    return tokens;
  }

  async logout(uid: string) {
    return await this.user.update({ id: +uid }, { token: null });
  }
}
