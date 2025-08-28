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
import { LeaveBalanceService } from './leave-balance.service';
import { CreateLeaveBalanceDto } from './dto/create-leave-balance.dto';
import { UpdateLeaveBalanceDto } from './dto/update-leave-balance.dto';

import { JwtGuard } from '../auth/guard/jwt.guard';
import { BaseResponse } from 'src/commons/dto/base-response.dto';
import { LeaveApplication } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('leave-balance')
export class LeaveBalanceController {
  constructor(private readonly leaveBalanceService: LeaveBalanceService) {}

  @Post()
  async create(@Body() createLeaveBalanceDto: CreateLeaveBalanceDto): Promise<LeaveApplication> {
    return await this.leaveBalanceService.create(createLeaveBalanceDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<BaseResponse<LeaveApplication[]>> {
    return await this.leaveBalanceService.findAllWithPagination(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<LeaveApplication | null> {
    return await this.leaveBalanceService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLeaveBalanceDto: UpdateLeaveBalanceDto
  ): Promise<LeaveApplication> {
    return await this.leaveBalanceService.update(id, updateLeaveBalanceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<LeaveApplication> {
    return await this.leaveBalanceService.remove(id);
  }
}
