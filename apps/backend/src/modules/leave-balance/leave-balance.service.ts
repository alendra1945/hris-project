import { Injectable } from '@nestjs/common';
import { CreateLeaveBalanceDto } from './dto/create-leave-balance.dto';
import { UpdateLeaveBalanceDto } from './dto/update-leave-balance.dto';
import { PrismaService } from 'nestjs-prisma';
import { LeaveApplication } from '@prisma/client';
import { BaseResponse } from 'src/commons/dto/base-response.dto';

@Injectable()
export class LeaveBalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLeaveBalanceDto: CreateLeaveBalanceDto): Promise<LeaveApplication> {
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
}
