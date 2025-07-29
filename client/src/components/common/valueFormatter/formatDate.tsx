import i18next from 'i18next';

// Function to pad single digit numbers with a leading zero
const pad = (number: number) => (number < 10 ? `0${number}` : number);

export const formatDate = (date: Date) => {
  if (!date) return '';

  const userLanguage = i18next.language;

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  if (userLanguage.startsWith('de')) {
    return `${day}.${month}.${year}`;
  } else {
    return `${month}-${day}-${year}`;
  }
};
