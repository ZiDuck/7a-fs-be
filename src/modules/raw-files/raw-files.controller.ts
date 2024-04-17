import { Controller } from '@nestjs/common';
import { RawFilesService } from './raw-files.service';

@Controller('raw-files')
export class RawFilesController {
  constructor(private readonly rawFilesService: RawFilesService) {}
}
