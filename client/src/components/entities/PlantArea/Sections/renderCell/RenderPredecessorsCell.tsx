import { Stack, Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { UIPredecessor } from '../../../../../interfaces/PredecessorRecord';

const RenderPredecessorsCell = (props: GridRenderCellParams) => {
  const { value } = props;
  if (!value) return null;
  return (
    <Stack>
      {value.map((pred: UIPredecessor, idx: number) => {
        return (
          <Typography
            key={idx}
          >{`${pred.section.name} - ${pred.vehicleClass.name} - ${pred.additionalInventory || 0}`}</Typography>
        );
      })}
    </Stack>
  );
};

export default RenderPredecessorsCell;
