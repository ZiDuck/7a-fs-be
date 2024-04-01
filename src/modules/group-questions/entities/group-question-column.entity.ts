import { Column, Entity, JoinColumn, OneToMany, OneToOne, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { GroupQuestionAttribute } from './group-question-attribute.entity';
import { GroupQuestionAnswer } from './group-question-answer.entity';

@Entity()
export class GroupQuestionColumn extends AppBaseEntity {
    @Column('varchar')
    value: string;

    @Column('uuid')
    groupId: GroupQuestionAttribute['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'groupId' })
    @OneToOne(() => GroupQuestionAttribute, (formQuestion: GroupQuestionAttribute) => formQuestion.groupQuestionValues, { onDelete: 'CASCADE' })
    group: Relation<GroupQuestionAttribute>;

    @OneToMany(() => GroupQuestionAnswer, (answer: GroupQuestionAnswer) => answer.groupQuestionColumn, {
        cascade: ['insert'],
        eager: true,
    })
    groupQuestionAnswer: Relation<GroupQuestionAnswer>[];
}
