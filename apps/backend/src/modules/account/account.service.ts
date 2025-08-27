import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string) {
    const user = await this.prisma.account.findUnique({
      where: {
        id,
      },
    });
    return user;
  }
}
