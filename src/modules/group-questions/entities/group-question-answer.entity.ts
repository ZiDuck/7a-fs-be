import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';

import { AppBaseEntity } from '../../../common/entities/base.entity';
import { GroupQuestionColumn } from './group-question-column.entity';
import { GroupQuestionRow } from './group-question-row.entity';

@Entity()
export class GroupQuestionAnswer extends AppBaseEntity {
    @Column('uuid')
    rowId: GroupQuestionRow['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'rowId' })
    @ManyToOne(() => GroupQuestionRow, (singleQuestionValue: GroupQuestionRow) => singleQuestionValue.groupQuestionAnswers, { onDelete: 'CASCADE' })
    groupQuestionRow: Relation<GroupQuestionRow>;

    @Column('uuid')
    columnId: GroupQuestionColumn['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'columnId' })
    @ManyToOne(() => GroupQuestionColumn, (singleQuestionValue: GroupQuestionColumn) => singleQuestionValue.groupQuestionAnswers, {
        onDelete: 'CASCADE',
    })
    groupQuestionColumn: Relation<GroupQuestionColumn>;

    @Column('boolean', { nullable: true })
    isCorrect: boolean;

    @DeleteDateColumn()
    deletedDate: Date;
}
