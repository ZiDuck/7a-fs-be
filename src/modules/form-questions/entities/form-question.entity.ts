import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { AttributeType } from '../enums/attribute-type.enum';
import { Form } from '../../forms/entities/form.entity';
import { Image } from '../../images/entites/image.entity';
import { SingleQuestionAttribute } from '../../single-questions/entities/single-question-attribute.entity';

@Entity()
export class FormQuestion extends AppBaseEntity {
    @Column('varchar', { length: 1000 })
    label: string;

    @Column('varchar', { length: 2000, nullable: true })
    description: string;

    @Column('boolean', { default: false })
    require: boolean;

    @Column('int4')
    order: number;

    @Column('uuid', { nullable: true })
    imageId: Image['id'];

    @Column('enum', { enum: AttributeType })
    attributeType: AttributeType;

    @Column('uuid')
    formId: Form['id'];

    @JoinColumn({ referencedColumnName: 'id', name: 'formId' })
    @ManyToOne(() => Form, (form: Form) => form.formQuestions)
    form: Relation<Form>;

    @OneToOne(() => SingleQuestionAttribute, (formQuestion: SingleQuestionAttribute) => formQuestion.question)
    formSingleAttribute?: Relation<SingleQuestionAttribute>;
}
