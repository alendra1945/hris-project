import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Account } from '@prisma/client';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { RolesGuard } from '../auth/guard/role.guard';
import { AccountService } from './account.service';
import { UpdateAccountEmployeeInformationRequest } from './dto/dto/update-account.dto';

@UseGuards(JwtGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get('me')
  async getMe(@GetUser() user: Account) {
    return this.accountService.getMe(user.id);
  }

  @Put('employee-information')
  async updateEmployeeInformation(@GetUser() user: Account, @Body() body: UpdateAccountEmployeeInformationRequest) {
    return this.accountService.updateEmployeeInformation(user.id, body);
  }
  @Get('list')
  @UseGuards(RolesGuard)
  async listAccount() {
    return this.accountService.listAccount();
  }
}
