export const audioTime = function(timer: number): string {
  let result: string = '';
  const m: number = parseInt(String(timer / 60));
  const s: number = parseInt(String(timer - m * 60));
  if (s < 10) {
    result = m + ':' + '0' + s;
  } else {
    result = m + ':' + s;
  }
  return result;
}
