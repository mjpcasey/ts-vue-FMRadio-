import * as moment from 'moment';
moment.locale('zh-CN');

/**
 * 获取当前时间相距ts的时间
 * @param ts 要查询与当前时间差的时间戳
 */
export function fromNow(ts: number): string {
  if (!ts) {
    return '';
  }
  if (moment().diff(ts, 'days') > 1) {
    return moment(ts).format('YYYY-MM-DD');
  } else {
    return moment(ts).fromNow();
  }
}
