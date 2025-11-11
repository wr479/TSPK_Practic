import { PartialType } from '@nestjs/mapped-types';
import { CreateParticipationFormatDto } from './create-participation-format.dto';

export class UpdateParticipationFormatDto extends PartialType(
  CreateParticipationFormatDto,
) {}

