import { Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { format, isValid } from 'date-fns';

const RenderTimeCell = (params: GridRenderCellParams) => {
  const { value } = params;
  if (!value || !isValid(new Date(value))) return null;
  const date = new Date(value);
  const seconds = date.getSeconds();
  const timeFormat = seconds === 0 ? 'HH:mm' : 'HH:mm:ss';
  const formattedValue = format(new Date(value), timeFormat);
  return <Typography>{formattedValue}</Typography>;
};

export default RenderTimeCell;
