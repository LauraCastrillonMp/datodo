import { PartialType } from '@nestjs/swagger';
import { CreateDataStructureDto } from './create-data-structure.dto';

export class UpdateDataStructureDto extends PartialType(CreateDataStructureDto) {}
