import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity';
import { SingleQuestionAttribute } from './single-question-attribute.entity';

@Entity()
export class SingleQuestionFileConfig extends AppBaseEntity {
    @Column('float', { default: 1 })
    maxNumOfFiles: number;

    @Column('float', { default: 10 })
    maxFileSize: number;

    @Column('uuid')
    attributeId: SingleQuestionAttribute['id'];

    @DeleteDateColumn()
    deletedDate: Date;

    @JoinColumn({ referencedColumnName: 'id', name: 'attributeId' })
    @OneToOne(() => SingleQuestionAttribute, (form: SingleQuestionAttribute) => form.fileConfig, { onDelete: 'CASCADE' })
    singleQuestionAttribute: Relation<SingleQuestionAttribute>;
}
