import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Account } from '@prisma/client';
import { GetUser } from '../auth/decorator/getUser.decorator';

@UseGuards(JwtGuard)
@Controller('account')
export class AccountController {
  @Get('me')
  async getMe(@GetUser() user: Account) {
    console.log(user);
    return user;
  }
}
