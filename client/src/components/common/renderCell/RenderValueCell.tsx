import { Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';

interface RenderValueCellProps extends GridRenderCellParams {
  displayZero?: boolean;
}

const RenderValueCell = (props: RenderValueCellProps) => {
  const { value, displayZero = false } = props;

  if (value === null || value === undefined || (!displayZero && value === 0)) {
    return null;
  }

  const displayValue = typeof value === 'object' ? value.name : value ?? '';
  return <Typography>{displayValue}</Typography>;
};

export default RenderValueCell;
