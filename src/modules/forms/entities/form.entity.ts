import { Column, DeleteDateColumn, Entity, OneToMany, Relation } from 'typeorm';

import { AuditEntity } from '../../../common/entities/audit.entity';
import { FormQuestion } from '../../form-questions/entities/form-question.entity';
import { Image } from '../../images/entites/image.entity';
import { FormCategory } from '../enums/form-category.enum';
import { FormStatus } from '../enums/form-status.enum';

@Entity()
export class Form extends AuditEntity {
    @Column('varchar', { length: 1000, default: '' })
    title: string;

    @Column('varchar', { length: 2000, nullable: true })
    description: string;

    @Column('timestamp', { nullable: true })
    startSurvey: Date;

    @Column('enum', { enum: FormStatus, default: FormStatus.PENDING })
    status: FormStatus;

    @Column('boolean', { default: false })
    hasAnswer: boolean;

    @Column('boolean', { default: false })
    canSeeCorrectAnswer: boolean;

    @Column('enum', { enum: FormCategory })
    category: FormCategory;

    @Column('uuid', { nullable: true })
    imageId: Image['id'];

    @Column('integer', { default: 0 })
    version: number;

    @OneToMany(() => FormQuestion, (formQuestion: FormQuestion) => formQuestion.form, { cascade: true })
    formQuestions: Relation<FormQuestion>[];

    @DeleteDateColumn()
    deletedDate: Date;
}
