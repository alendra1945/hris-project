import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Put,
} from '@nestjs/common';
import { EmployeeInformationService } from './employee-information.service';
import { CreateEmployeeInformationRequest } from './dto/create-employee-information.dto';
import { UpdateEmployeeInformationRequest } from './dto/update-employee-information.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { BaseResponse } from 'src/commons/dto/base-response.dto';
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search: string
  ): Promise<BaseResponse<EmployeeInformation[]>> {
    console.log({ page, limit });
    return await this.employeeInformationService.findAllWithPagination(page, limit, search);
  }
  @Get('overview')
  async getEmployeeOverview() {
    return await this.employeeInformationService.getEmployeeOverview();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.employeeInformationService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateEmployeeInformationRequest: UpdateEmployeeInformationRequest) {
    return this.employeeInformationService.update(id, updateEmployeeInformationRequest);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.employeeInformationService.remove(id);
  }
}
