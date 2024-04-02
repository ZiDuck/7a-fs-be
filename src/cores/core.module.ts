import { DynamicModule } from '@nestjs/common';
import { CurrentUserContext } from './providers/current-user-context.provider';

interface AsyncContextModuleOptions {
    isGlobal?: boolean;
}

export class CoreModule {
    static forRoot(options?: AsyncContextModuleOptions): DynamicModule {
        const isGlobal = options?.isGlobal ?? true;

        return {
            module: CoreModule,
            global: isGlobal,
            providers: [CurrentUserContext],
            exports: [CurrentUserContext],
        };
    }
}
