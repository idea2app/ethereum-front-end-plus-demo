export const MBTI_TYPE = [
  ["E", "I"],
  ["S", "N"],
  ["T", "F"],
  ["J", "P"],
];

export const convertMbtiToDecimalNumber = (mbtiString: string) => {
  // 将字符串转换为大写字符
  const mbtiStringUpperCase = mbtiString.toLocaleUpperCase();

  // 先验证字符串的有效性，如不符合返回 -1
  if(!/^[EI][SN][TF][JP]$/.test(mbtiStringUpperCase)) return -1;

  // 遍历并生成二进制字符串
  const mbtiBinaryString = mbtiStringUpperCase
    .split('')
    .map((element, index) => MBTI_TYPE[index].indexOf(element) )
    .join('');

  // 将二进制字符串转换为十进制数字
  return Number.parseInt(mbtiBinaryString, 2)
}

export const convertMbtiToString = (mbtiDecimalNumber: number) => {
  // 验证传入值得范围是 0-15，不符合则返回空字符串
  if(mbtiDecimalNumber < 0 || mbtiDecimalNumber > 15) return '';

  // 将十进制数字转换为二进制字符串
  const mbtiBinaryString = Number(mbtiDecimalNumber).toString(2);

  // 遍历二进制字符串生成 MBTI 字符串
  return mbtiBinaryString.padStart(4, '0')
    .split('')
    .map((element, index) => MBTI_TYPE[index][Number.parseInt(element)])
    .join('');
}