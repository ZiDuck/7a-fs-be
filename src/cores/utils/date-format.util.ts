import dayjs from 'dayjs';

export function setDate(rtc: Array<number>): dayjs.Dayjs {
    return dayjs(`${rtc[0]}/${rtc[1]}/${rtc[2]} ${rtc[3]}:${rtc[4]}:${rtc[5]}`, ['YYYY', 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'], true);
}

export function formatDateTime(data: Date) {
    return dayjs(data).format('YYYY-MM-DD');
}
