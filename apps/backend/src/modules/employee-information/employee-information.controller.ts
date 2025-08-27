import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { EmployeeInformationService } from './employee-information.service';
import { CreateEmployeeInformationRequest } from './dto/create-employee-information.dto';
import { UpdateEmployeeInformationRequest } from './dto/update-employee-information.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { BaseResponse } from 'dto/base-response.dto';
import { EmployeeInformation } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('employee-information')
export class EmployeeInformationController {
  constructor(private readonly employeeInformationService: EmployeeInformationService) {}

  @Post()
  async create(
    @Body() createEmployeeInformationRequest: CreateEmployeeInformationRequest
  ): Promise<CreateEmployeeInformationRequest> {
    return await this.employeeInformationService.create(createEmployeeInformationRequest);
  }

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20
  ): Promise<BaseResponse<EmployeeInformation[]>> {
    return await this.employeeInformationService.findAllWithPagination(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.employeeInformationService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEmployeeInformationRequest: UpdateEmployeeInformationRequest) {
    return this.employeeInformationService.update(id, updateEmployeeInformationRequest);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.employeeInformationService.remove(id);
  }
}
