import { ApiProperty } from '@nestjs/swagger';
import { ImageOutput } from '../../images/dto/image.output';

export class GetSingleQuestionValue {
    @ApiProperty()
    id: string;

    @ApiProperty({
        nullable: true,
        example: 'Value of the question',
    })
    value: string | null;

    @ApiProperty({
        type: ImageOutput,
        nullable: true,
    })
    image: ImageOutput | null;

    @ApiProperty({
        nullable: true,
        example: true,
    })
    isCorrect: boolean | null;

    // @Exclude()
    // createdDate: Date;

    // @Exclude()
    // updatedDate: Date;
}
