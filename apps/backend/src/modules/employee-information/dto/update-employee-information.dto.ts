import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeInformationRequest } from './create-employee-information.dto';

export class UpdateEmployeeInformationRequest extends PartialType(CreateEmployeeInformationRequest) {}
