import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';
import { Image } from '../../images/entites/image.entity';
import { SingleQuestionAttribute } from './single-question-attribute.entity';

@Entity()
export class SingleQuestionValue extends AppBaseEntity {
    @Column('varchar')
    value: string;

    @Column('uuid', { nullable: true })
    imageId: Image['id'];

    @Column('boolean', { default: false })
    isCorrect: boolean;

    @Column('boolean', { default: false })
    isOther: boolean;

    @Column('int4')
    order: number;

    @Column('uuid')
    attributeId: SingleQuestionAttribute['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'attributeId' })
    @ManyToOne(() => SingleQuestionAttribute, (form: SingleQuestionAttribute) => form.singleQuestionValues, { onDelete: 'CASCADE' })
    singleQuestionAttribute: Relation<SingleQuestionAttribute>;

    @DeleteDateColumn()
    deletedDate: Date;

    constructor(partial: Partial<SingleQuestionValue>) {
        super();
        Object.assign(this, partial);
    }
}
