export const formatDate = (date) => {
  const yy = String(date.getFullYear()).slice(2); // 연도 마지막 두 자리
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // 월 (0부터 시작하므로 +1)
  const dd = String(date.getDate()).padStart(2, "0"); // 일
  const hh = String(date.getHours()).padStart(2, "0"); // 시
  const min = String(date.getMinutes()).padStart(2, "0"); // 분
  const sec = String(date.getSeconds()).padStart(2, "0"); // 초

  return `${yy}.${mm}.${dd} ${hh}:${min}:${sec}`;
}
