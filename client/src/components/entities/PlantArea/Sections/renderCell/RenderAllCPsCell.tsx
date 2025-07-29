import { Stack, Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { UISection } from '../../../../../interfaces/Sections';

const RenderAllCPsCell = (
  params: GridRenderCellParams<UISection, UISection['allCPs']>
) => {
  const { value } = params;
  if (!value?.planCheckpoint) return null;
  return (
    <Stack>
      {value.planCheckpoint && (
        <Typography variant={'body1'}>
          <strong>P:</strong> {value.planCheckpoint.name}
        </Typography>
      )}
      {value.dueCheckpoint && (
        <Typography variant={'body1'}>
          <strong>S:</strong> {value.dueCheckpoint}
        </Typography>
      )}
      {value.virtualPlanCheckpoint && (
        <Typography variant={'body1'}>
          <strong>vP:</strong> {value.virtualPlanCheckpoint}
        </Typography>
      )}
      {value.virtualDueCheckpoint && (
        <Typography variant={'body1'}>
          <strong>vS:</strong> {value.virtualDueCheckpoint}
        </Typography>
      )}
    </Stack>
  );
};
export default RenderAllCPsCell;
