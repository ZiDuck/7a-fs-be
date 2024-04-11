import { Column, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { FormQuestion } from '../../form-questions/entities/form-question.entity';
import { GroupQuestionRow } from './group-question-row.entity';
import { GroupQuestionColumn } from './group-question-column.entity';

@Entity()
export class GroupQuestionAttribute extends AppBaseEntity {
    @Column('uuid')
    questionId: FormQuestion['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'questionId' })
    @OneToOne(() => FormQuestion, (formQuestion: FormQuestion) => formQuestion.formGroupAttribute, { onDelete: 'CASCADE' })
    question: Relation<FormQuestion>;

    @OneToMany(() => GroupQuestionRow, (groupQuestionRow: GroupQuestionRow) => groupQuestionRow.group, {
        cascade: true,
        eager: true,
    })
    groupQuestionRows: Relation<GroupQuestionRow>[];

    @OneToMany(() => GroupQuestionColumn, (groupQuestionColumn: GroupQuestionColumn) => groupQuestionColumn.group, {
        cascade: true,
        eager: true,
    })
    groupQuestionColumns: Relation<GroupQuestionColumn>[];

    @DeleteDateColumn()
    deletedDate: Date;
}
