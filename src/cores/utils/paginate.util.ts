import { SelectQueryBuilder } from 'typeorm';
import { PageQueryDto } from '../../common/dtos/page-query.dto';
import { PageDto } from '../../common/dtos/page.dto';

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

export async function paginateDynamicFilter<T>(source: SelectQueryBuilder<T>, { page, take }: PageQueryDto) {
    const count$ = source.getCount();
    const items$ = source
        // .orderBy()
        .getMany();
    const [count, items] = await Promise.all([count$, items$]);
    return new PageDto<T>(items, count, page, take);
}
