import { EmployeeStatus, Gender } from '@prisma/client';
import { IsNotEmpty, IsString, IsDateString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeInformationRequest {
  @IsString()
  @IsNotEmpty()
  employeeNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  companyEmail: string;

  @ApiProperty({
    enum: Gender,
  })
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  address: string;

  @IsDateString()
  dateOfJoining: Date;

  @IsString()
  branch: string;

  @IsString()
  department: string;

  @ApiProperty({
    enum: EmployeeStatus,
  })
  @IsNotEmpty()
  status: EmployeeStatus;
}
