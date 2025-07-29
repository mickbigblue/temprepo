import { Box } from '@mui/material';
import { GridRowModesModel, GridToolbarProps } from '@mui/x-data-grid-premium';
import Uploady, { UploadyProps } from '@rpldy/uploady';
import React from 'react';
import { IdRecord } from '../../interfaces/IdRecord';
import { NameIdRecord } from '../../interfaces/NameIdRecord';
import { EntityType } from '../../types';
import UploadCSVButton from './UploadCSVButton';
import EditToolbar from './EditToolbar';

type GridRowType<T> = T & {
  isNew?: boolean;
};

export interface ToolbarComponentProps<T extends IdRecord = IdRecord>
  extends Partial<GridToolbarProps> {
  setRows?: React.Dispatch<React.SetStateAction<GridRowType<T>[]>>;
  setRowModesModel?: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
  defaults?: any;
  entityType?: EntityType;
  additionalData?: { [key: string]: NameIdRecord[] };
  listeners?: UploadyProps['listeners'];
  parentId?: number;
}

const ToolbarComponent: React.FC<ToolbarComponentProps> = ({
  setRows,
  setRowModesModel,
  defaults,
  entityType,
  additionalData,
  listeners,
  parentId,
  ...rest
}) => {
  return (
    <Box display="flex" justifyContent="space-between" {...rest}>
      {setRows && setRowModesModel && defaults && entityType && (
        <EditToolbar
          setRows={setRows}
          setRowModesModel={setRowModesModel}
          defaults={defaults}
          entityType={entityType}
        />
      )}
      {entityType &&
        additionalData &&
        (entityType === 'capacities' || entityType === 'quantities') && (
          <div>
            <Uploady
              clearPendingOnAdd
              listeners={listeners}
              multiple={false}
              accept=".csv"
            >
              <UploadCSVButton
                additionalData={additionalData}
                entityType={entityType}
                parentId={parentId}
              />
            </Uploady>
          </div>
        )}
    </Box>
  );
};

export default React.memo(ToolbarComponent);
