import { ApiProperty } from '@nestjs/swagger';
import { LeaveStatus, LeaveType } from '@prisma/client';
import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLeaveBalanceDto {
  @IsString()
  @IsNotEmpty()
  employeeNumber: string;

  @IsString()
  @IsNotEmpty()
  employeeName: string;

  @IsEmail()
  @IsNotEmpty()
  employeeEmail: string;

  @IsString()
  @IsNotEmpty()
  leaveApproverNumber: string;

  @IsString()
  @IsNotEmpty()
  leaveApproverName: string;

  @IsEmail()
  @IsNotEmpty()
  leaveApproverEmail: string;

  @ApiProperty({ enum: LeaveType })
  @IsNotEmpty()
  leaveType: LeaveType;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsBoolean()
  @IsOptional()
  isHalfDay?: boolean;

  @IsBoolean()
  @IsOptional()
  followViaEmail?: boolean;

  @ApiProperty({ enum: LeaveStatus, required: false })
  @IsOptional()
  status?: LeaveStatus;
}
