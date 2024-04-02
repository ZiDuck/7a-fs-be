import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, RecoverEvent, SoftRemoveEvent, UpdateEvent } from 'typeorm';
import { User } from '../entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { ClsService } from 'nestjs-cls';
import { Injectable } from '@nestjs/common';
import { USER_AUDIT } from '../../../cores/constants';
import { UsersService } from '../users.service';

@Injectable()
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(
        dataSource: DataSource,
        private readonly cls: ClsService,
        private readonly userService: UsersService,
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

    async beforeUpdate(event: UpdateEvent<User>) {
        // Save user log for update
    }

    async afterUpdate(event: UpdateEvent<User>) {
        // Save user audit log
        // const userUpdateId = this.currentUserContext.getUserId();
        // const userUpdateId = this.cls.get('UserUpdateId');
        // const updatedUser = await this.userService.findOne(userUpdateId);
        // const userAudit = await this.userAuditService.create(
        //     plainToInstance(CreateUserAuditDto, {
        //         ...updatedUser,
        //         userId: userUpdateId,
        //         hashedPassword: updatedUser.hashedPassword,
        //         deletedDate: updatedUser.deletedDate,
        //     }),
        // );
        // this.cls.set(USER_AUDIT, userAudit);
    }

    async afterSoftRemove(event: SoftRemoveEvent<User>) {
        // const userAudit = await this.userAuditService.create(
        //     plainToInstance(CreateUserAuditDto, {
        //         ...event.entity,
        //         userId: event.entity.id,
        //     }),
        // );
        // this.cls.set(USER_AUDIT, userAudit);
    }

    async afterRecover(event: RecoverEvent<User>) {
        // const userAudit = await this.userAuditService.create(
        //     plainToInstance(CreateUserAuditDto, {
        //         ...event.entity,
        //         userId: event.entity.id,
        //     }),
        // );
        // this.cls.set(USER_AUDIT, userAudit);
    }
}
