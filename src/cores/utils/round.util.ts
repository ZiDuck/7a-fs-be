// export function roundNumber(num: number) {
//     var m = Number((Math.abs(num) * 100).toPrecision(15));
//     return (Math.round(m) / 100) * Math.sign(num);
// }
export function roundNumber(num: number) {
    if (typeof num !== 'number') {
        return num;
    }
    // Làm tròn số với độ chính xác 2 chữ số thập phân
    const roundedNum = Math.round(num * 100) / 100;

    // Chuyển số thành chuỗi và thêm số 0 nếu cần
    const roundedString = roundedNum.toFixed(2);

    // Chuyển chuỗi về dạng số
    return parseFloat(roundedString);
}
