// export function numberToArab(num: string) {
//   const numArr = [];
//
//   for (let i = 1, length = num.length; i < length; i ++) {
//     if (i % 3 === 0) {
//       numArr.push(num.slice(i - 3, i));
//     }
//   }
//   numArr.unshift(num.slice(0, 3));
//   return numArr.join(',');
// }

export function numberToArab(num: string) {
  let result = ''
  while (num.length > 3) {
      result = ',' + num.slice(-3) + result
      num = num.slice(0, num.length - 3)
  }
  if (num) { result = num + result }
  return result
}
