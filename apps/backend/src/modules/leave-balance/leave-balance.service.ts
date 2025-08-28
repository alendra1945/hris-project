import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLeaveBalanceDto } from './dto/create-leave-balance.dto';
import { UpdateLeaveBalanceDto } from './dto/update-leave-balance.dto';
import { PrismaService } from 'nestjs-prisma';
import { LeaveApplication, LeaveStatus } from '@prisma/client';
import { BaseResponse } from 'src/commons/dto/base-response.dto';

@Injectable()
export class LeaveBalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLeaveBalanceDto: CreateLeaveBalanceDto): Promise<LeaveApplication> {
    await this.validateLeaveBalance(createLeaveBalanceDto.employeeNumber, createLeaveBalanceDto.startDate);
    return await this.prisma.leaveApplication.create({
      data: createLeaveBalanceDto,
    });
  }

  async findAllWithPagination(page: number = 1, limit: number = 20): Promise<BaseResponse<LeaveApplication[]>> {
    const data = await this.prisma.leaveApplication.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'asc' },
    });
    const total = await this.prisma.leaveApplication.count();
    return {
      data,
      pagination: { page, limit, total },
    };
  }

  async findOne(id: string): Promise<LeaveApplication | null> {
    return await this.prisma.leaveApplication.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateLeaveBalanceDto: UpdateLeaveBalanceDto): Promise<LeaveApplication> {
    await this.validateLeaveBalance(updateLeaveBalanceDto.employeeNumber, updateLeaveBalanceDto.startDate);
    return await this.prisma.leaveApplication.update({
      where: { id },
      data: updateLeaveBalanceDto,
    });
  }

  async remove(id: string): Promise<LeaveApplication> {
    return await this.prisma.leaveApplication.delete({
      where: { id },
    });
  }

  async validateLeaveBalance(employeeNumber: string, startDate: string) {
    const requestedDate = new Date(startDate);
    const currentYear = requestedDate.getFullYear();
    const requestedMonth = requestedDate.getMonth();

    // Check yearly quota (12 days maximum)
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

    const approvedLeavesThisYear = await this.prisma.leaveApplication.count({
      where: {
        employeeNumber,
        status: LeaveStatus.APPROVED,
        startDate: {
          gte: yearStart,
          lte: yearEnd,
        },
      },
    });
    console.log(approvedLeavesThisYear);

    if (approvedLeavesThisYear >= 12) {
      throw new BadRequestException(
        `Leave request rejected: You have already used your yearly quota of 12 leave days. Current usage: ${approvedLeavesThisYear}/12`
      );
    }

    // Check monthly restriction (1 leave per month)
    const monthStart = new Date(currentYear, requestedMonth, 1);
    const monthEnd = new Date(currentYear, requestedMonth + 1, 0, 23, 59, 59);

    const approvedLeavesThisMonth = await this.prisma.leaveApplication.count({
      where: {
        employeeNumber,
        status: LeaveStatus.APPROVED,
        startDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    console.log(approvedLeavesThisMonth);

    if (approvedLeavesThisMonth >= 1) {
      throw new BadRequestException(
        `Leave request rejected: You have already taken leave in ${monthStart.toLocaleString('default', { month: 'long', year: 'numeric' })}. Only 1 leave day per month is allowed.`
      );
    }
    return true;
  }
}
