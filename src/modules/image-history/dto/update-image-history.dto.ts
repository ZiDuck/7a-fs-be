import { PartialType } from '@nestjs/swagger';

import { CreateImageHistoryDto } from './create-image-history.dto';

export class UpdateImageHistoryDto extends PartialType(CreateImageHistoryDto) {}
