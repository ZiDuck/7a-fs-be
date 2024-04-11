import { Column, DeepPartial, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { FormQuestion } from '../../form-questions/entities/form-question.entity';
import { SingleQuestionValue } from './single-question-value.entity';
import { SingleQuestionFileConfig } from './single-question-file-config.entity';

@Entity()
export class SingleQuestionAttribute extends AppBaseEntity {
    @Column('float', { default: 0 })
    score: number;

    @Column('boolean', { default: false })
    isOther: boolean;

    @Column('uuid')
    questionId: FormQuestion['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'questionId' })
    @OneToOne(() => FormQuestion, (form: FormQuestion) => form.formSingleAttribute, { onDelete: 'CASCADE' })
    question: Relation<FormQuestion>;

    @OneToMany(() => SingleQuestionValue, (singleQuestionValue: SingleQuestionValue) => singleQuestionValue.singleQuestionAttribute, {
        cascade: true,
        eager: true,
    })
    singleQuestionValues: Relation<SingleQuestionValue>[];

    @OneToOne(() => SingleQuestionFileConfig, (fileConfig: SingleQuestionFileConfig) => fileConfig.singleQuestionAttribute, {
        cascade: true,
        nullable: true,
        eager: true,
    })
    fileConfig: Relation<SingleQuestionFileConfig>;

    @DeleteDateColumn()
    deletedDate: Date;

    constructor(partial: DeepPartial<SingleQuestionAttribute>) {
        super();
        Object.assign(this, partial);
    }
}
