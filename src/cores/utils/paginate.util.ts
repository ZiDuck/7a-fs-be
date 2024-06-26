import { SelectQueryBuilder } from 'typeorm';

import { PageDto } from '../../common/dtos/page.dto';
import { PageQueryDto } from '../../common/dtos/page-query.dto';

export async function paginate<T>(source: SelectQueryBuilder<T>, { page, take }: PageQueryDto) {
    const count$ = source.getCount();
    const items$ = source
        // .orderBy(orderBy ? `${orderBy}` : 'createdDate', order)
        .skip((page - 1) * take)
        .take(take)
        .getMany();
    const [count, items] = await Promise.all([count$, items$]);
    return new PageDto<T>(items, count, page, take);
}

export async function paginateRaw<T>(source: SelectQueryBuilder<T>, { page, take }: PageQueryDto) {
    const count$ = source.getCount();
    const items$ = source
        // .orderBy(orderBy ? `${orderBy}` : 'createdDate', order)
        .skip((page - 1) * take)
        .take(take)
        .getRawMany();
    const [count, items] = await Promise.all([count$, items$]);
    return new PageDto<T>(items, count, page, take);
}

export async function paginateDynamicFilter<T>(source: SelectQueryBuilder<T>, { page, take }: PageQueryDto) {
    const count$ = source.getCount();
    const items$ = source
        // .orderBy()
        .getMany();
    const [count, items] = await Promise.all([count$, items$]);
    return new PageDto<T>(items, count, page, take);
}
