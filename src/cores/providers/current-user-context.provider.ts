import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class CurrentUserContext {
    constructor(private readonly cls: ClsService) {}

    setUserId(id: string) {
        this.cls.set('userId', id);
    }

    getUserId(): string {
        return this.cls.get('userId');
    }
}
