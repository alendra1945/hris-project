import { Injectable } from '@nestjs/common';
import { CreateEmployeeInformationRequest } from './dto/create-employee-information.dto';
import { UpdateEmployeeInformationRequest } from './dto/update-employee-information.dto';
import { PrismaService } from 'nestjs-prisma';
import { EmployeeInformation } from '@prisma/client';
import { BaseResponse } from 'src/commons/dto/base-response.dto';

@Injectable()
export class EmployeeInformationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeInformationDto: CreateEmployeeInformationRequest): Promise<EmployeeInformation> {
    return await this.prisma.employeeInformation.create({
      data: createEmployeeInformationDto,
    });
  }

  async findAllWithPagination(
    page: number = 1,
    limit: number = 20,
    search: string = ''
  ): Promise<BaseResponse<EmployeeInformation[]>> {
    const data = await this.prisma.employeeInformation.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'asc' },
      where: {
        OR: [
          {
            firstName: {
              contains: search,
            },
          },
          {
            lastName: {
              contains: search,
            },
          },
        ],
      },
    });
    const total = await this.prisma.employeeInformation.count();
    return {
      data,
      pagination: { page, limit, total },
    };
  }

  async findOne(id: string): Promise<EmployeeInformation | null> {
    return await this.prisma.employeeInformation.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    updateEmployeeInformationDto: UpdateEmployeeInformationRequest
  ): Promise<EmployeeInformation> {
    return await this.prisma.employeeInformation.update({
      where: { id },
      data: updateEmployeeInformationDto,
    });
  }

  async remove(id: string): Promise<EmployeeInformation> {
    return await this.prisma.employeeInformation.delete({
      where: { id },
    });
  }
  async getEmployeeOverview() {
    const totalEmployee = await this.prisma.employeeInformation.count();
    const totalFemaleEmployee = await this.prisma.employeeInformation.count({
      where: {
        gender: 'FEMALE',
      },
    });
    const totalMaleEmployee = await this.prisma.employeeInformation.count({
      where: {
        gender: 'MALE',
      },
    });
    return {
      totalEmployee,
      totalMaleEmployee,
      totalFemaleEmployee,
    };
  }
}
