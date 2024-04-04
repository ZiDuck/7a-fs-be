import { ApiProperty } from '@nestjs/swagger';
import { ImageOutput } from '../../images/dto/image.output';

export class GetSingleQuestionValue {
    @ApiProperty()
    id: string;

    @ApiProperty({
        example: 'Value of the question',
    })
    value: string;

    @ApiProperty({
        type: ImageOutput,
        nullable: true,
    })
    image: ImageOutput | null;

    @ApiProperty({
        example: true,
    })
    isCorrect: boolean;

    // @Exclude()
    // createdDate: Date;

    // @Exclude()
    // updatedDate: Date;
}
