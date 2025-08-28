import { Injectable } from '@nestjs/common';
import { CreateReportingTemplateDto } from './dto/create-reporting-template.dto';
import { UpdateReportingTemplateDto } from './dto/update-reporting-template.dto';
import { PrismaService } from 'nestjs-prisma';
import { BaseResponse } from 'src/commons/dto/base-response.dto';
import { ReportTemplate } from '@prisma/client';
import { defaultMetadata, defaultSource } from 'src/commons/constants/report';

@Injectable()
export class ReportingTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReportingTemplateDto): Promise<ReportTemplate> {
    return this.prisma.reportTemplate.create({
      data: { ...dto, source: defaultSource, metadata: defaultMetadata },
    });
  }

  async findAllWithPagination(page: number = 1, limit: number = 20): Promise<BaseResponse<ReportTemplate[]>> {
    const data = await this.prisma.reportTemplate.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'asc' },
    });
    const total = await this.prisma.reportTemplate.count();
    return {
      data,
      pagination: { page, limit, total },
    };
  }

  async findOne(id: string): Promise<ReportTemplate | null> {
    return this.prisma.reportTemplate.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateReportingTemplateDto): Promise<ReportTemplate> {
    return this.prisma.reportTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<ReportTemplate> {
    return this.prisma.reportTemplate.delete({
      where: { id },
    });
  }
}
