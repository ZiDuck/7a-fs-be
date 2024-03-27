import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { FormStatus } from '../enums/form-status.enum';
import { FormCategory } from '../enums/form-category.enum';
import { FormQuestion } from '../../form-questions/entities/form-question.entity';
import { Image } from '../../images/entites/image.entity';

@Entity()
export class Form extends AppBaseEntity {
    @Column('varchar', { length: 1000, default: '' })
    title: string;

    @Column('varchar', { length: 2000, nullable: true })
    description: string;

    @Column('timestamp')
    startSurvey: Date;

    @Column('enum', { enum: FormStatus })
    status: FormStatus;

    @Column('boolean', { default: false })
    hasAnswer: boolean;

    @Column('enum', { enum: FormCategory })
    category: FormCategory;

    @Column('uuid', { nullable: true })
    imageId: Image['id'];

    @OneToMany(() => FormQuestion, (formQuestion: FormQuestion) => formQuestion.form)
    formQuestions: Relation<FormQuestion>[];
}
