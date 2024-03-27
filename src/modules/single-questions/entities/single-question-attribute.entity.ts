import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { FormQuestion } from '../../form-questions/entities/form-question.entity';
import { SingleQuestionValue } from './single-question-value.entity';
import { SingleQuestionAnswer } from './single-question-answer.entity';

@Entity()
export class SingleQuestionAttribute extends AppBaseEntity {
    @Column('float', { nullable: true })
    score: number;

    @Column('boolean', { default: false })
    isOther: boolean;

    @Column('uuid')
    questionId: FormQuestion['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'questionId' })
    @OneToOne(() => FormQuestion, (form: FormQuestion) => form.formSingleAttribute, { onDelete: 'CASCADE' })
    question: Relation<FormQuestion>;

    @OneToMany(() => SingleQuestionValue, (singleQuestionValue: SingleQuestionValue) => singleQuestionValue.singleQuestionAttribute)
    singleQuestionValues: Relation<SingleQuestionValue>;

    @OneToMany(() => SingleQuestionValue, (singleQuestionValue: SingleQuestionValue) => singleQuestionValue.singleQuestionAttribute)
    singleQuestionAnswers?: Relation<SingleQuestionAnswer>;
}
