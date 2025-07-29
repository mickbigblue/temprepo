import { Paper, Stack } from '@mui/material';
import {
  EntityType,
  ParentEntityConfigType,
  SubEntityConfigType,
  SubEntityType,
} from '../../types';
import DataProvider from '../DataProvider';
import { useConfig } from '../../contexts/ConfigContext';

interface DetailPanelContentProps {
  parentId: number;
  parentEntityType: EntityType;
  onDataLoaded: (rowId: number) => void;
  onParentRefresh?: () => void;
}

const DetailPanelContent = ({
  parentId,
  parentEntityType,
  onDataLoaded,
  onParentRefresh,
}: DetailPanelContentProps) => {
  const config = useConfig(parentEntityType) as ParentEntityConfigType;
  const subEntityConfig = config.subEntityConfig as SubEntityConfigType;
  const subEntityType = subEntityConfig.entityType as SubEntityType;

  return (
    <Stack
      sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <DataProvider
          entityType={parentEntityType}
          parentId={parentId}
          subEntityType={subEntityType}
          onDataLoaded={onDataLoaded}
          onParentRefresh={onParentRefresh}
        />
      </Paper>
    </Stack>
  );
};

export default DetailPanelContent;
