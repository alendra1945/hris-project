import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class UpdateAccountEmployeeInformationRequest {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    enum: Gender,
  })
  @IsNotEmpty()
  gender: Gender;

  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;
}
