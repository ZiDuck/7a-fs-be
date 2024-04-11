import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm';
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
        cascade: true,
        eager: true,
    })
    groupQuestionAnswers: Relation<GroupQuestionAnswer>[];

    @DeleteDateColumn()
    deletedDate: Date;

    constructor(partial: Partial<GroupQuestionColumn>) {
        super();
        Object.assign(this, partial);
    }
}
