import { SetMetadata } from '@nestjs/common';

import { FORM_LOGGING_DATA } from '../constants';

export const FormLogging = (value: string) => SetMetadata(FORM_LOGGING_DATA, value);
