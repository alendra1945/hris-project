import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeInformationRequest } from './dto/create-employee-information.dto';
import { UpdateEmployeeInformationRequest } from './dto/update-employee-information.dto';
import { PrismaService } from 'nestjs-prisma';
import { EmployeeInformation } from '@prisma/client';
import { BaseResponse } from 'dto/base-response.dto';

@Injectable()
export class EmployeeInformationService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEmployeeInformationRequest: CreateEmployeeInformationRequest) {
    const exitedEmployee = await this.prisma.employeeInformation.findUnique({
      where: {
        employeeNumber: createEmployeeInformationRequest.employeeNumber,
      },
    });
    if (exitedEmployee) {
      throw new BadRequestException('Employee number already exists');
    }
    const employee = await this.prisma.employeeInformation.create({
      data: createEmployeeInformationRequest,
    });
    return employee;
  }

  async findAllWithPagination(page: number = 1, limit: number = 20): Promise<BaseResponse<EmployeeInformation[]>> {
    const data = await this.prisma.employeeInformation.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    console.log('res', data);
    const total = await this.prisma.employeeInformation.count();
    return {
      data,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async findOne(id: string) {
    return await this.prisma.employeeInformation.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateEmployeeInformationDto: UpdateEmployeeInformationRequest) {
    return await this.prisma.employeeInformation.update({
      where: {
        id,
      },
      data: updateEmployeeInformationDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.employeeInformation.delete({
      where: {
        id,
      },
    });
  }
}
