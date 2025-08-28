import { Controller, Get, Post, Body, Param, Delete, Query, Put, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ReportingTemplateService } from './reporting-template.service';
import { CreateReportingTemplateDto } from './dto/create-reporting-template.dto';
import { UpdateReportingTemplateDto } from './dto/update-reporting-template.dto';
import { ReportTemplate } from '@prisma/client';
import { BaseResponse } from 'src/commons/dto/base-response.dto';
import { UpdateLeaveBalanceDto } from '../leave-balance/dto/update-leave-balance.dto';

@Controller('reporting-template')
export class ReportingTemplateController {
  constructor(private readonly reportingTemplateService: ReportingTemplateService) {}

  @Post()
  create(@Body() createReportingTemplateDto: CreateReportingTemplateDto) {
    return this.reportingTemplateService.create(createReportingTemplateDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<BaseResponse<ReportTemplate[]>> {
    return await this.reportingTemplateService.findAllWithPagination(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReportTemplate | null> {
    return await this.reportingTemplateService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReportingTemplateDto: UpdateReportingTemplateDto
  ): Promise<ReportTemplate> {
    return await this.reportingTemplateService.update(id, updateReportingTemplateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ReportTemplate> {
    return await this.reportingTemplateService.remove(id);
  }
}
