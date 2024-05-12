import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, SoftRemoveEvent, UpdateEvent } from 'typeorm';

import { FORM_AUDIT } from '../../../cores/constants';
import { CurrentUserContext } from '../../../cores/providers/current-user-context.provider';
import { Form } from '../entities/form.entity';

@Injectable()
@EventSubscriber()
export class FormSubscriber implements EntitySubscriberInterface<Form> {
    constructor(
        dataSource: DataSource,
        private readonly currentUserContext: CurrentUserContext,
        private readonly cls: ClsService,
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return Form;
    }

    beforeInsert(event: InsertEvent<Form>) {
        event.entity.createdBy = this.currentUserContext.getUserId();
    }

    beforeUpdate(event: UpdateEvent<Form>) {
        event.entity.updatedBy = this.currentUserContext.getUserId();
    }

    afterInsert(event: InsertEvent<Form>) {
        this.cls.set(FORM_AUDIT, event.entityId);
    }

    afterSoftRemove(event: SoftRemoveEvent<Form>): void | Promise<any> {
        this.cls.set(FORM_AUDIT, event.entityId);
    }
    
    // afterUpdate(event: UpdateEvent<Form>) {
    //     this.cls.set(FORM_AUDIT, event.entity.id);
    // }
}
