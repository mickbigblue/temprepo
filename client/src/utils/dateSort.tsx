import { UIQuantity } from '../interfaces/Quantities';

export const sortByDate = (data: UIQuantity[]) => {
  return [...data].sort((a, b) => {
    if (a.date === null && b.date === null) return 0;
    if (a.date === null) return 1;
    if (b.date === null) return -1;
    return a.date!.getTime() - b.date!.getTime();
  });
};
