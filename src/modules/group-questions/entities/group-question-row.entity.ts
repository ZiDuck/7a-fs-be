import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { GroupQuestionAttribute } from './group-question-attribute.entity';
import { GroupQuestionAnswer } from './group-question-answer.entity';

@Entity()
export class GroupQuestionRow extends AppBaseEntity {
    @Column('float', { nullable: true })
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
        cascade: ['insert'],
        eager: true,
    })
    groupQuestionAnswers: Relation<GroupQuestionAnswer>[];
}
