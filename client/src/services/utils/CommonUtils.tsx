import i18next from '../../i18n';

export class CommonUtils {
  public static convertDecimal = (
    value: string | undefined | null,
    decPlaces: number = 3
  ) => {
    if (value) {
      if (value.includes(',') || value.includes('.')) {
        const convertedValue = value.replace(',', '.');
        return CommonUtils.truncateToXDecimalPlaces(convertedValue, decPlaces);
      }
      return value;
    } else {
      return '';
    }
  };

  private static truncateToXDecimalPlaces = (
    value: string,
    decPlaces: number
  ) => {
    const preDecPlaces = value.split('.')[0];
    const postDecPlaces = value.split('.')[1].substring(0, decPlaces);

    return preDecPlaces + '.' + postDecPlaces;
  };

  public static capitalize = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  public static generateDateString = (
    date: Date | null,
    dateTime: boolean = false
  ) => {
    if (!date) {
      return '';
    } else {
      const lang = i18next.languages[0].slice(0, 2);
      let dateString = '';
      switch (lang) {
        case 'de': {
          dateString =
            ('0' + date.getDate()).slice(-2) +
            '.' +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            '.' +
            date.getFullYear();
          if (dateTime) {
            dateString +=
              ' ' + date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2);
          }
          break;
        }

        // Default: 'en'
        default: {
          dateString =
            ('0' + (date.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + date.getDate()).slice(-2) +
            '-' +
            date.getFullYear();
          if (dateTime) {
            dateString +=
              ' ' + date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2);
          }
          break;
        }
      }
      return dateString;
    }
  };
}
