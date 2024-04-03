import { Column, Entity, JoinColumn, OneToMany, OneToOne, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { FormQuestion } from '../../form-questions/entities/form-question.entity';
import { SingleQuestionValue } from './single-question-value.entity';

@Entity()
export class SingleQuestionAttribute extends AppBaseEntity {
    @Column('float', { default: 0 })
    score: number;

    @Column('boolean', { default: false })
    isOther: boolean;

    @Column('uuid')
    questionId: FormQuestion['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'questionId' })
    @OneToOne(() => FormQuestion, (form: FormQuestion) => form.formSingleAttribute, { onDelete: 'CASCADE' })
    question: Relation<FormQuestion>;

    @OneToMany(() => SingleQuestionValue, (singleQuestionValue: SingleQuestionValue) => singleQuestionValue.singleQuestionAttribute, {
        cascade: ['insert'],
        eager: true,
    })
    singleQuestionValues: Relation<SingleQuestionValue>[];
}
