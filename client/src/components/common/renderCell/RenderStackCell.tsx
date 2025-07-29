import { Stack, Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { NameIdRecord } from '../../../interfaces/NameIdRecord';
import i18n from 'i18next';

const RenderStackCell = (props: GridRenderCellParams) => {
  const { value } = props;

  if (!value) return null;
  return (
    <Stack>
      {value.map((item: NameIdRecord, idx: number) => {
        return <Typography key={item.id}>{i18n.t(item.name)}</Typography>;
      })}
    </Stack>
  );
};

export default RenderStackCell;
