import { Distribution } from './distribution.dto';
import { RangeSummary } from './range.dto';

export class Insights {
    totalPoint: number;
    averageScore: number;
    medianScore: number;
    range: RangeSummary;
    totalPointsDistribution: Distribution[];

    constructor(data: Partial<Insights>) {
        Object.assign(this, data);
        this.range = new RangeSummary(data.range!);
        this.totalPointsDistribution = data.totalPointsDistribution!.map((d) => new Distribution(d));
    }
}
