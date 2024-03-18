import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> extends PageMetaDto<T> {
    // @IsArray()
    // @ApiProperty({ isArray: true })
    // readonly data: T[];

    // @ApiProperty({ type: () => PageMetaDto })
    // readonly meta: PageMetaDto;

    constructor(items: T[], count: number, page: number, take: number) {
        super(items, count, page, take);
    }
}
