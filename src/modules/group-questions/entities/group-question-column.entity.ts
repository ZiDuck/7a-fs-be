import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { GroupQuestionAttribute } from './group-question-attribute.entity';
import { GroupQuestionAnswer } from './group-question-answer.entity';

@Entity()
export class GroupQuestionColumn extends AppBaseEntity {
    @Column('varchar')
    value: string;

    @Column('integer')
    order: number;

    @Column('uuid')
    groupId: GroupQuestionAttribute['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'groupId' })
    @ManyToOne(() => GroupQuestionAttribute, (formQuestion: GroupQuestionAttribute) => formQuestion.groupQuestionColumns, { onDelete: 'CASCADE' })
    group: Relation<GroupQuestionAttribute>;

    @OneToMany(() => GroupQuestionAnswer, (answer: GroupQuestionAnswer) => answer.groupQuestionColumn, {
        cascade: ['insert'],
        eager: true,
    })
    groupQuestionAnswers: Relation<GroupQuestionAnswer>[];
}
