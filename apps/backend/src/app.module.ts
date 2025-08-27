import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { PipelineModule } from './modules/pipeline/pipeline.module';
import { ConfigModule } from '@nestjs/config';
import { EmployeeInformationModule } from './modules/employee-information/employee-information.module';

@Module({
  imports: [
    PrismaModule.forRoot({ isGlobal: true }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    AccountModule,
    PipelineModule,
    EmployeeInformationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
