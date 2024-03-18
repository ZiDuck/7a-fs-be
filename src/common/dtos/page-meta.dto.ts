import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export abstract class PageMetaDto<T> {
    @IsArray()
    // @ApiProperty({ isArray: true, type: T as any })
    readonly items: T[];

    @ApiProperty()
    readonly page: number;

    @ApiProperty()
    readonly take: number;

    @ApiProperty()
    readonly pageCount: number;

    @ApiProperty()
    readonly hasPreviousPage: boolean;

    @ApiProperty()
    readonly hasNextPage: boolean;

    // constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    //     this.page = pageOptionsDto.page;
    //     this.take = pageOptionsDto.take;
    //     this.itemCount = itemCount;
    //     this.pageCount = Math.ceil(this.itemCount / this.take);
    //     this.hasPreviousPage = this.page > 1;
    //     this.hasNextPage = this.page < this.pageCount;
    // }
    constructor(items: T[], count: number, page: number, take: number) {
        this.page = page;
        this.take = take;
        this.items = items;
        this.pageCount = Math.ceil(count / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}
