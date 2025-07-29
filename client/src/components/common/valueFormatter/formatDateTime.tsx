import i18next from 'i18next';

// Function to pad single digit numbers with a leading zero
const pad = (number: number) => (number < 10 ? `0${number}` : number);

export const formatDateTime = (date: Date) => {
  if (!date) return '';

  const userLanguage = i18next.language;

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  if (userLanguage.startsWith('de')) {
    // German format: DD.MM.YYYY HH:MM:SS
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  } else {
    // Default format: MM-DD-YYYY HH:MM:SS
    return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
  }
};
