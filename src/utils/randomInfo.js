export const generateNickname = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let nickname = chars[Math.floor(Math.random() * chars.length)];
  for (let i = 1; i < 10; i++) {
    const source = Math.random() > 0.3 ? chars : numbers;
    nickname += source[Math.floor(Math.random() * source.length)];
  }
  return nickname;
};

export const generateEmail = (nickname) => {
  return `${nickname.toLowerCase()}@test.test`;
};

export const generatePassword = () => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const allChars = uppercase + lowercase + numbers;
  
  return (
    uppercase[Math.floor(Math.random() * uppercase.length)] +
    lowercase[Math.floor(Math.random() * lowercase.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    Array.from({ length: 10 }, () => allChars[Math.floor(Math.random() * allChars.length)]).join("")
  );
};
