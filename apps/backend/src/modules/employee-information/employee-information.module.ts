import { Module } from '@nestjs/common';
import { EmployeeInformationService } from './employee-information.service';
import { EmployeeInformationController } from './employee-information.controller';

@Module({
  controllers: [EmployeeInformationController],
  providers: [EmployeeInformationService],
})
export class EmployeeInformationModule {}
