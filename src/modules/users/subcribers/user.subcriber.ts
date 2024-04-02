import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, RecoverEvent, SoftRemoveEvent } from 'typeorm';
import { User } from '../entities/user.entity';
import { ClsService } from 'nestjs-cls';
import { Injectable } from '@nestjs/common';
import { USER_AUDIT } from '../../../cores/constants';

@Injectable()
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(
        dataSource: DataSource,
        private readonly cls: ClsService,
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return User;
    }

    async afterInsert(event: InsertEvent<User>) {
        // Save user audit log

        this.cls.set(USER_AUDIT, event.entity.id);
    }

    // async afterUpdate(event: UpdateEvent<User>) {
    //     this.cls.set(USER_AUDIT, event.entity.id);
    // }

    async afterSoftRemove(event: SoftRemoveEvent<User>) {
        // const userAudit = await this.userAuditService.create(
        //     plainToInstance(CreateUserAuditDto, {
        //         ...event.entity,
        //         userId: event.entity.id,
        //     }),
        // );
        // this.cls.set(USER_AUDIT, userAudit);
        this.cls.set(USER_AUDIT, event.entity.id);
    }

    async afterRecover(event: RecoverEvent<User>) {
        // const userAudit = await this.userAuditService.create(
        //     plainToInstance(CreateUserAuditDto, {
        //         ...event.entity,
        //         userId: event.entity.id,
        //     }),
        // );
        // this.cls.set(USER_AUDIT, userAudit);
        this.cls.set(USER_AUDIT, event.entity.id);
    }
}
