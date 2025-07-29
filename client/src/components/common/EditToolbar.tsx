import AddIcon from '@mui/icons-material/Add';
import { Box, Button, MenuItem, useTheme } from '@mui/material';
import {
  GridCsvExportMenuItem,
  GridExportMenuItemProps,
  GridRowModes,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExportContainer,
  useGridApiContext,
} from '@mui/x-data-grid-premium';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { usePrivilegesContext } from '../../contexts/PrivilegesContext';
import { EntityType } from '../../types';
import { exportTxt } from '../../utils/customExport';
import { useSnackbarContext } from '../../contexts/SnackbarContext';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';

interface EditToolbarProps {
  setRows: (newRows: (oldRows: any[]) => any[]) => void;
  setRowModesModel: (newModel: (oldModel: any) => any) => void;
  defaults: Record<string, any>;
  entityType: EntityType;
}

const TxtExportMenuItem = (props: GridExportMenuItemProps<{}>) => {
  const { hideMenu } = props;
  const apiRef = useGridApiContext();

  return (
    <MenuItem
      onClick={() => {
        exportTxt(apiRef as React.MutableRefObject<GridApiPremium>);
        hideMenu?.();
      }}
    >
      Export TXT
    </MenuItem>
  );
};

const CustomExportButton = (props: any) => {
  return (
    <GridToolbarExportContainer {...props}>
      <GridCsvExportMenuItem options={{ delimiter: ',' }} />
      <TxtExportMenuItem />
    </GridToolbarExportContainer>
  );
};

const EditToolbar: React.FC<EditToolbarProps> = ({
  setRows,
  setRowModesModel,
  defaults,
  entityType,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const apiRef = useGridApiContext();
  const { hasPrivilege } = usePrivilegesContext();
  const { closeSnackbar } = useSnackbarContext();

  const handleClick = () => {
    closeSnackbar();
    const tempId = uuidv4();
    setRows((oldRows) => [
      { id: tempId, ...defaults, isNew: true },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [tempId]: {
        mode: GridRowModes.Edit,
        fieldToFocus: Object.keys(defaults)[0],
      },
    }));

    setTimeout(() => {
      if (apiRef.current) {
        apiRef.current.scrollToIndexes({
          rowIndex: 0,
        });
        apiRef.current.setCellFocus(tempId, Object.keys(defaults)[0]);
      }
    }, 100);
  };

  return (
    <GridToolbarContainer>
      {hasPrivilege(entityType) && 'quantities' !== entityType && (
        <Button
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
          color="inherit"
          startIcon={<AddIcon />}
          onClick={handleClick}
        >
          {t('AddRecord')}
        </Button>
      )}
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
};

export default EditToolbar;
