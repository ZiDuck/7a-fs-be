import { Column, Entity, JoinColumn, OneToMany, OneToOne, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { FormQuestion } from '../../form-questions/entities/form-question.entity';
import { GroupQuestionRow } from './group-question-row.entity';

@Entity()
export class GroupQuestionAttribute extends AppBaseEntity {
    @Column('uuid')
    questionId: FormQuestion['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'questionId' })
    @OneToOne(() => FormQuestion, (formQuestion: FormQuestion) => formQuestion.formGroupAttribute, { onDelete: 'CASCADE' })
    question: Relation<FormQuestion>;

    @OneToMany(() => GroupQuestionRow, (singleQuestionValue: GroupQuestionRow) => singleQuestionValue.group, {
        cascade: ['insert'],
        eager: true,
    })
    groupQuestionValues: Relation<GroupQuestionRow>[];
}
