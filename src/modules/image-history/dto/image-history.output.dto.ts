import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ImageHistory } from '../entities/image-history.entity';
import { ImageOutput } from '../../images/dto/image.output';

@Expose()
export class GetImageHistoryOutput extends ImageHistory {
    @ApiProperty()
    id: string;

    @ApiProperty()
    hasDeleted: boolean;

    @ApiProperty({ type: ImageOutput })
    @Type(() => ImageOutput)
    image: ImageOutput;

    @ApiProperty()
    createdDate: Date;

    @Exclude()
    updatedDate: Date;
}
