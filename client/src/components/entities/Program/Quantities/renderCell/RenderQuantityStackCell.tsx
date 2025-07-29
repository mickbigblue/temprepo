import { Stack, Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { UILineWithCapacity } from '../../../../../interfaces/Quantities';

const RenderQuantityStackCell = (props: GridRenderCellParams) => {
  const { value } = props;

  if (!value) return null;
  return (
    <Stack>
      {value.map((item: UILineWithCapacity, idx: number) => {
        return (
          <Typography key={idx}>
            {item.name} ({item.capacity})
          </Typography>
        );
      })}
    </Stack>
  );
};

export default RenderQuantityStackCell;
