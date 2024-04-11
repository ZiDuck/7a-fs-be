import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Form } from '../entities/form.entity';
import { CurrentUserContext } from '../../../cores/providers/current-user-context.provider';

@Injectable()
@EventSubscriber()
export class FormSubscriber implements EntitySubscriberInterface<Form> {
    constructor(
        dataSource: DataSource,
        private readonly currentUserContext: CurrentUserContext,
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
}
