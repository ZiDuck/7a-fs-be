import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { GroupQuestionRow } from './group-question-row.entity';
import { GroupQuestionColumn } from './group-question-column.entity';

@Entity()
export class GroupQuestionAnswer extends AppBaseEntity {
    @Column('uuid')
    rowId: GroupQuestionRow['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'rowId' })
    @ManyToOne(() => GroupQuestionRow, (singleQuestionValue: GroupQuestionRow) => singleQuestionValue.groupQuestionAnswer, {
        onDelete: 'CASCADE',
    })
    groupQuestionRow: Relation<GroupQuestionRow>[];

    @Column('uuid')
    columnId: GroupQuestionColumn['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'columnId' })
    @ManyToOne(() => GroupQuestionRow, (singleQuestionValue: GroupQuestionColumn) => singleQuestionValue.groupQuestionAnswer, {
        onDelete: 'CASCADE',
    })
    groupQuestionColumn: Relation<GroupQuestionRow>[];
}
