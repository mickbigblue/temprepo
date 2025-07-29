import { HighlightOff } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveIcon from '@mui/icons-material/Save';
import { Box, styled } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Switch from '@mui/material/Switch';
import {
  DataGridPremium,
  GridActionsCellItem,
  GridColDef,
  GridDensity,
  GridEventListener,
  GridPaginationModel,
  GridRenderEditCellParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  gridClasses,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { deDE } from '@mui/x-data-grid/locales';
import { LicenseInfo } from '@mui/x-license';
import { UPLOADER_EVENTS } from '@rpldy/uploady';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../contexts/ConfigContext';
import { usePaginationContext } from '../../contexts/PaginationContext';
import { usePrivilegesContext } from '../../contexts/PrivilegesContext';
import { useSnackbarContext } from '../../contexts/SnackbarContext';
import { useRestApi } from '../../hooks/useRestApi';
import { IdRecord } from '../../interfaces/IdRecord';
import { UrlProvider } from '../../services/utils/UrlProvider';
import { EntityType, isParentEntityConfig } from '../../types';
import DetailPanelContent from './DetailPanelContent';
import ToolbarComponent, { ToolbarComponentProps } from './ToolbarComponent';

LicenseInfo.setLicenseKey(
  '094e14165a237c568056f73bc4f0889dTz0xMDg1ODcsRT0xNzcyMTA4NzQxMDk4LFM9cHJlbWl1bSxMTT1zdWJzY3JpcHRpb24sUFY9UTMtMjAyNCxLVj0y'
);

type GridRowType<T> = T & {
  isNew?: boolean;
};

interface GridManagerProps<T extends IdRecord> {
  entityType: EntityType;
  parentId?: number;
  data: any[];
  additionalData: any;
  columns: GridColDef[];
  isLoading: boolean;
  showActions?: boolean;
  onAdd: (item: T) => any;
  onUpdate: (item: T) => void;
  onDelete: (item: T) => void;
  onRefresh?: () => void;
}

interface ColumnVisibilityModel {
  [key: string]: boolean;
}

const StyledButton = styled(Button)(({ theme }) => ({
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
}));

const StyledDataGridPremium = styled(DataGridPremium)(({ theme }) => ({
  '& .MuiDataGrid-row--densityCompact': {
    height: 24,
  },
  '& .MuiDataGrid-row--densityStandard': {
    height: 36,
  },
  '& .MuiDataGrid-row--densityComfortable': {
    height: 48,
  },
  '& .actions-cell': {
    '&:focus': {
      outline: 'none',
      border: 'none',
    },
    textAlign: 'center',
  },
  '& .pfm-theme--columnHeaders': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  '& .MuiDataGrid-row': {
    '&:nth-of-type(odd)': {
      backgroundColor: '#ffffff',
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#f7f7f7',
    },
    [`& .${gridClasses.columnHeader}`]: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.contrastText,
      fontSize: '1rem',
      fontWeight: 'bold',
    },
    [`& .${gridClasses.detailPanelToggleCell}`]: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.contrastText,
      fontSize: '1rem',
      fontWeight: 'bold',
    },
  },
  '& .MuiDataGrid-root': {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  '& .MuiDataGrid-main': {
    flexGrow: 1,
  },
  '& .MuiDataGrid-columnHeaders': {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const GridManager = <T extends IdRecord>({
  entityType,
  parentId,
  data,
  additionalData,
  columns,
  isLoading,
  showActions = true,
  onAdd,
  onUpdate,
  onDelete,
  onRefresh,
}: GridManagerProps<T>) => {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const { pageSize } = usePaginationContext();
  const { hasPrivilege } = usePrivilegesContext();
  const { get } = useRestApi();
  const { t, i18n } = useTranslation();
  const config = useConfig(entityType);
  const defaults = config.defaults;
  const { openSnackbar } = useSnackbarContext();
  const [rows, setRows] = useState<GridRowType<T>[]>([]);
  const userLanguage = i18n.languages[0];

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [density, setDensity] = useState<GridDensity>('standard');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: pageSize,
    page: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<GridRowId | null>(null);
  const [tempToBackendIdMap, setTempToBackendIdMap] = useState<{
    [key: string]: string;
  }>({});

  const hiddenFields = config.hiddenFields;
  const apiRef = useGridApiRef();

  useEffect(() => {
    apiRef.current?.setPageSize(pageSize);
  }, [pageSize, apiRef]);

  useEffect(() => {
    const newRows = data.map((d) => ({ ...d, isNew: false }));
    setRows(newRows);
  }, [data]);

  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel
  ) => {
    setPaginationModel(newPaginationModel);

    // Scroll the first row on the new page into view
    // For the current grid or its container
    if (gridContainerRef.current) {
      gridContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const enhancedColumns = columns.map((column) => {
    if (column.renderEditCell) {
      return {
        ...column,
        renderEditCell: (params: GridRenderEditCellParams) =>
          column.renderEditCell!({ ...params, data, additionalData }),
      };
    }
    return column;
  });

  const handleRowEditStart: GridEventListener<'rowEditStart'> = (
    params,
    event
  ) => {
    if (!hasPrivilege(entityType)) {
      event.defaultMuiPrevented = true;
      return;
    }

    const currentRow = data.find((d) => d.id === params.id);
    if (currentRow) {
      const newRowData = {
        ...params.row,
        ...currentRow.editData,
        isNew: params.row.isNew,
      };

      setRows(rows.map((row) => (row.id === params.id ? newRowData : row)));
    }
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    if (hasPrivilege(entityType)) {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.Edit },
      });
    }
  };

  const handleSaveClick = (id: GridRowId) => async () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View },
    });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    if (hasPrivilege(entityType)) {
      setSelectedRowId(id);
      setOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedRowId !== null) {
      const rowToDelete = rows.find((row) => row.id === selectedRowId);
      if (rowToDelete) {
        const backendId = tempToBackendIdMap[selectedRowId] || selectedRowId;
        const rowWithBackendId = { ...rowToDelete, id: backendId };

        try {
          onDelete(rowWithBackendId as T);
          onRefresh?.();
        } catch (error) {
          console.error('Failed to delete row', error);
          openSnackbar('Failed to delete row', 'error');
        }

        setSelectedRowId(null);
        setOpen(false);
      }
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow && editedRow.isNew) {
      setRows((currentRows) => currentRows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel) => {
      try {
        if (newRow.isNew) {
          const response = await onAdd(newRow as T);
          if (response?.statusCode === 200 || response?.statusCode === 202) {
            onRefresh?.();
            return newRow;
          }
        } else {
          onUpdate(newRow as T);
          onRefresh?.();
        }
        return newRow;
      } catch (error) {
        openSnackbar('Failed to update row', 'error');
        throw error;
      }
    },
    [onAdd, onUpdate, onRefresh, openSnackbar]
  );

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const updateGridWidth = () => {
    if (gridContainerRef.current) {
      setGridWidth(gridContainerRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateGridWidth();
    window.addEventListener('resize', updateGridWidth);
    return () => window.removeEventListener('resize', updateGridWidth);
  }, []);

  const handleDownloadClick = async (id: string) => {
    const downloadURI = UrlProvider.getFileDownloadUrl();

    const queryParams = {
      filename: id,
    };
    const data = await get(downloadURI, true, queryParams);
    if (data.statusCode === 200) {
      window.open(data.url);
    }
  };

  const modifiedColumns = () => {
    let baseColumns = [...enhancedColumns];
    if (showActions) {
      baseColumns.push({
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        headerClassName: 'pfm-theme--columnHeaders',
        cellClassName: 'actions-cell',
        headerAlign: 'center',
        width: 125,
        maxWidth: 125,
        getActions: (params: GridRowModel) => {
          const isInEditMode =
            rowModesModel[params.id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            const saveButton = (
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(params.id)}
              />
            );
            const cancelButton = (
              <GridActionsCellItem
                icon={<CancelIcon sx={{ color: 'red' }} />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(params.id)}
                color="inherit"
              />
            );
            const clearButton = (
              <GridActionsCellItem
                icon={<HighlightOff />}
                disabled={!params.row.cellsEditable}
                label="Clear"
                onClick={() => {
                  apiRef.current?.setEditCellValue({
                    id: params.id,
                    field: 'manualAuditDebt',
                    value: '',
                  });
                  apiRef.current?.setEditCellValue({
                    id: params.id,
                    field: 'validFrom',
                    value: null,
                  });
                  apiRef.current?.setEditCellValue({
                    id: params.id,
                    field: 'validTo',
                    value: null,
                  });
                }}
                color="secondary"
              />
            );
            const toggleSwitch = (
              <Switch
                checked={params.row.cellsEditable}
                onChange={(event) => {
                  apiRef.current?.updateRows([
                    { id: params.id, cellsEditable: event.target.checked },
                  ]);
                }}
                sx={{ marginTop: 1 }}
              />
            );
            if (entityType === 'audits') {
              return [
                clearButton,
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  key={params.id}
                >
                  <Box display="flex" flexDirection="row" alignItems="center">
                    {saveButton}
                    {cancelButton}
                  </Box>
                  {toggleSwitch}
                </Box>,
              ];
            } else {
              return [saveButton, cancelButton];
            }
          }
          const editButton = (
            <GridActionsCellItem
              disabled={!hasPrivilege(entityType)}
              icon={
                <EditIcon
                  sx={
                    hasPrivilege(entityType)
                      ? { color: 'green' }
                      : { color: 'grey' }
                  }
                />
              }
              label="Edit"
              onClick={handleEditClick(params.id)}
              color="inherit"
            />
          );
          const deleteButton = (
            <GridActionsCellItem
              disabled={!hasPrivilege(entityType)}
              icon={
                <DeleteIcon
                  sx={
                    hasPrivilege(entityType)
                      ? { color: 'red' }
                      : { color: 'grey' }
                  }
                />
              }
              label="Delete"
              onClick={handleDeleteClick(params.id)}
              color="inherit"
            />
          );
          return entityType !== 'quantities'
            ? [editButton, deleteButton]
            : [editButton];
        },
      });
    }

    if (entityType === 'filedownload') {
      baseColumns.push({
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        headerClassName: 'pfm-theme--columnHeaders',
        cellClassName: 'actions-cell',
        headerAlign: 'center',
        width: 80,
        maxWidth: 80,
        getActions: (params: GridRowModel) => {
          const downloadButton = (
            <GridActionsCellItem
              icon={<DownloadIcon sx={{ color: 'black' }} />}
              label="Download"
              onClick={() => handleDownloadClick(params.id)}
              color="inherit"
            />
          );
          return [downloadButton];
        },
      });
    }
    return baseColumns;
  };

  // Calculate column widths, distributing width equally
  // Subtract a little for the scrollbar
  const resizedColumns = modifiedColumns().map((column: GridColDef) => ({
    ...column,
    width: (gridWidth - 20) / columns.length,
  }));

  const getTogglableColumns = () => {
    return resizedColumns
      .filter((column) => !hiddenFields.includes(column.field))
      .map((column) => column.field);
  };

  const [openedDetailPanels, setOpenedDetailPanels] = useState<Set<GridRowId>>(
    new Set()
  );

  const scrollToDetailPanel = useCallback(
    (rowId: GridRowId) => {
      if (openedDetailPanels.has(rowId)) {
        return;
      }

      const rowElement = document.querySelector(`[data-id="${rowId}"]`);
      const detailPanelElement = rowElement?.nextElementSibling;

      if (detailPanelElement) {
        detailPanelElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        setOpenedDetailPanels((prev) => new Set(prev).add(rowId));
      }
    },
    [openedDetailPanels]
  );

  const handleDataLoaded = useCallback(
    (rowId: number) => {
      scrollToDetailPanel(rowId);
    },
    [scrollToDetailPanel]
  );

  const getDetailPanelContent = useCallback(
    ({ row }: GridRowModel) => {
      if (
        isParentEntityConfig(config) &&
        config.subEntityConfig &&
        !row.isNew
      ) {
        return (
          <DetailPanelContent
            parentId={row.id}
            parentEntityType={entityType}
            onDataLoaded={handleDataLoaded}
            onParentRefresh={onRefresh}
          />
        );
      }
      return null;
    },
    [config, entityType, handleDataLoaded, onRefresh]
  );

  const getDetailPanelHeight = useCallback(() => {
    if (isParentEntityConfig(config) && config.subEntityConfig) {
      return 'auto';
    }
    return 0;
  }, [config]);

  const customColumnVisibilityModel =
    hiddenFields.reduce<ColumnVisibilityModel>((acc, field) => {
      acc[field] = false;
      return acc;
    }, {});

  const handleDetailPanelExpand = async (expandedRowIds: GridRowId[]) => {
    // We handle expansion via callback in the DataProvider to avoid
    // hangs on large datasets
  };

  const listeners = useMemo(
    () => ({
      [UPLOADER_EVENTS.ITEM_FINISH]: (item: any) => {
        openSnackbar(t('ImportSuccess'), 'success', []);
        onRefresh?.();
      },
      [UPLOADER_EVENTS.ITEM_ERROR]: (item: any) => {
        let errorMessage = `Error! Status: ${String(item.uploadStatus)} - See Server Log for more Information.`;
        if (item.uploadStatus === 500) {
          errorMessage = item.uploadResponse.data.messages[0].message;
        }
        console.error(errorMessage, item);
        openSnackbar(errorMessage, 'error', []);
      },
    }),
    [openSnackbar, t, onRefresh]
  );

  return (
    <>
      <div
        ref={gridContainerRef}
        style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <StyledDataGridPremium
          rows={rows}
          columns={resizedColumns}
          apiRef={apiRef as React.MutableRefObject<GridApiPremium>}
          density={density}
          loading={isLoading}
          onDensityChange={(newDensity) => setDensity(newDensity)}
          onRowModesModelChange={handleRowModesModelChange}
          getDetailPanelContent={
            isParentEntityConfig(config) && config.subEntityConfig
              ? getDetailPanelContent
              : undefined
          }
          getDetailPanelHeight={
            isParentEntityConfig(config) && config.subEntityConfig
              ? getDetailPanelHeight
              : undefined
          }
          onRowEditStop={handleRowEditStop}
          onRowEditStart={handleRowEditStart}
          onDetailPanelExpandedRowIdsChange={handleDetailPanelExpand}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) =>
            console.error('updaterror', error)
          }
          editMode="row"
          rowModesModel={rowModesModel}
          getRowHeight={() => 'auto'}
          localeText={
            userLanguage.startsWith('de')
              ? deDE.components.MuiDataGrid.defaultProps.localeText
              : {}
          }
          // autoHeight
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          slots={{
            toolbar: ToolbarComponent,
            detailPanelExpandIcon: AddCircleIcon,
            detailPanelCollapseIcon: RemoveCircleIcon,
          }}
          initialState={{
            columns: {
              columnVisibilityModel: customColumnVisibilityModel,
            },
            sorting: {
              sortModel: config.initialSort,
            },
          }}
          slotProps={{
            toolbar: {
              setRows,
              setRowModesModel,
              defaults,
              entityType,
              additionalData,
              listeners,
              parentId,
            } as ToolbarComponentProps<T>,
            columnsManagement: { getTogglableColumns },
          }}
          sx={{
            // For sticky column headers
            [`.${gridClasses.virtualScroller}, .${gridClasses.main}`]: {
              overflow: 'unset !important',
            },
            '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
              py: '8px',
            },
            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
              py: '15px',
            },
            '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
              py: '22px',
            },
          }}
        />
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          disableRestoreFocus
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t('ConfirmDialog')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('ReallyDelete')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              {t('Cancel')}
            </Button>
            <StyledButton
              onClick={handleConfirmDelete}
              color="primary"
              autoFocus
            >
              {t('Delete')}
            </StyledButton>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default GridManager;
