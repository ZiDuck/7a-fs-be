import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { GroupQuestionAttribute } from './group-question-attribute.entity';
import { GroupQuestionAnswer } from './group-question-answer.entity';

@Entity()
export class GroupQuestionRow extends AppBaseEntity {
    @Column('float', { default: 0 })
    score: number;

    @Column('varchar')
    value: string;

    @Column('uuid')
    groupId: GroupQuestionAttribute['id'];

    @Column('integer')
    order: number;

    @JoinColumn({ referencedColumnName: 'id', name: 'groupId' })
    @ManyToOne(() => GroupQuestionAttribute, (formQuestion: GroupQuestionAttribute) => formQuestion.groupQuestionRows, { onDelete: 'CASCADE' })
    group: Relation<GroupQuestionAttribute>;

    @OneToMany(() => GroupQuestionAnswer, (answer: GroupQuestionAnswer) => answer.groupQuestionRow, {
        cascade: true,
        eager: true,
    })
    groupQuestionAnswers: Relation<GroupQuestionAnswer>[];

    @DeleteDateColumn()
    deletedDate: Date;

    constructor(partial: Partial<GroupQuestionRow>) {
        super();
        Object.assign(this, partial);
    }
}
