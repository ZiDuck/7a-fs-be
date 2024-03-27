import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { SingleQuestionAttribute } from './single-question-attribute.entity';

@Entity()
export class SingleQuestionAnswer extends AppBaseEntity {
    @Column('uuid')
    attributeId: SingleQuestionAttribute['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'attributeId' })
    @ManyToOne(() => SingleQuestionAttribute, (form: SingleQuestionAttribute) => form.singleQuestionAnswers, { onDelete: 'CASCADE' })
    singleQuestionAttribute: Relation<SingleQuestionAttribute>;
}
