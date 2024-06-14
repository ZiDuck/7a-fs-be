import { SetMetadata } from '@nestjs/common';

import { AUTH_LOGGING_DATA } from '../constants';

export const AuthLogging = (value: string) => SetMetadata(AUTH_LOGGING_DATA, value);
