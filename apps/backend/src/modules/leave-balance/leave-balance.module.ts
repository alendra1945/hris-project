import { Module } from '@nestjs/common';
import { LeaveBalanceService } from './leave-balance.service';
import { LeaveBalanceController } from './leave-balance.controller';

@Module({
  controllers: [LeaveBalanceController],
  providers: [LeaveBalanceService],
})
export class LeaveBalanceModule {}
