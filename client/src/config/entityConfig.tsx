import { styled } from '@mui/material';
import {
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  GridSortDirection,
} from '@mui/x-data-grid-premium';
import RenderDateCell from '../components/common/renderCell/RenderDateCell';
import RenderDateTimeCell from '../components/common/renderCell/RenderDateTimeCell';
import RenderNonEditableCell from '../components/common/renderCell/RenderNonEditableCell';
import RenderStackCell from '../components/common/renderCell/RenderStackCell';
import RenderTimeCell from '../components/common/renderCell/RenderTimeCell';
import RenderValueCell from '../components/common/renderCell/RenderValueCell';
import EditDateCell from '../components/common/renderEditCell/EditDateCell';
import EditDateTimeCell from '../components/common/renderEditCell/EditDateTimeCell';
import EditNameIdCell from '../components/common/renderEditCell/EditNameIdCell';
import EditNameIdDropdownCell from '../components/common/renderEditCell/EditNameIdDropdownCell';
import EditNumberCell from '../components/common/renderEditCell/EditNumberCell';
import EditStringCell from '../components/common/renderEditCell/EditStringCell';
import EditTimeCell from '../components/common/renderEditCell/EditTimeCell';
import { formatDateTime } from '../components/common/valueFormatter/formatDateTime';
import RenderAudits from '../components/entities/DLZParameterization/AuditCapacities/renderCell/RenderAudits';
import EditPrivilegesCell from '../components/entities/Permissions/Roles/renderEditCell/EditPrivilegesCell';
import EditRolesCell from '../components/entities/Permissions/Users/renderEditCell/EditRolesCell';
import RenderAllCPsCell from '../components/entities/PlantArea/Sections/renderCell/RenderAllCPsCell';
import RenderPredecessorsCell from '../components/entities/PlantArea/Sections/renderCell/RenderPredecessorsCell';
import RenderSchedCell from '../components/entities/PlantArea/Sections/renderCell/RenderSchedCell';
import EditCTBackpacksCell from '../components/entities/PlantArea/Sections/renderEditCell/EditCtBackpacksCell';
import EditPlanCPCell from '../components/entities/PlantArea/Sections/renderEditCell/EditPlanCPCell';
import EditPredecessorsCell from '../components/entities/PlantArea/Sections/renderEditCell/EditPredecessorsCell';
import EditSchedCell from '../components/entities/PlantArea/Sections/renderEditCell/EditSchedCell';
import EditTypeCell from '../components/entities/PlantArea/Sections/renderEditCell/EditTypeCell';
import EditVirtualVehicleClassCell from '../components/entities/PlantArea/Sections/renderEditCell/EditVirtualVehicleClassCell';
import EditWorkingHoursCell from '../components/entities/PlantArea/Shifts/renderEditCell/EditWorkingHoursCell';
import EditCapaDateCell from '../components/entities/Program/Capacities/renderEditCell/EditCapaDateCell';
import RenderQuantities from '../components/entities/Program/Distributions/RenderQuantities';
import {
  EditPredecessorDropdownCell,
  EditSectionDropdownCell,
  EditVehicleClassDropdownCell,
} from '../components/entities/Program/Distributions/renderEditCell/EditDistributionDropdowns';
import RenderQuantityStackCell from '../components/entities/Program/Quantities/renderCell/RenderQuantityStackCell';
import EditPccCell from '../components/entities/Rules/CTBackpacks/renderEditCell/EditPccCell';
import EditVehicleRuleCell from '../components/entities/Rules/CTBackpacks/renderEditCell/EditVehicleRuleCell';
import RenderPartialRules from '../components/entities/Rules/VehicleRules/renderCell/RenderPartialRules';
import i18n from '../i18n';
import { UrlProvider } from '../services/utils/UrlProvider';
import { ParentEntityConfigType, ParentEntityType } from '../types';
import { getCustomFilterComparator } from '../utils/getCustomFilterComparator';
import { getCustomSortComparator } from '../utils/getCustomSortComparator';

type EntityConfigurationMap = {
  [K in ParentEntityType]: ParentEntityConfigType;
};

const { t } = i18n;

const StyledHeader = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '1rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}));

const entityConfig: EntityConfigurationMap = {
  sections: {
    columns: [
      {
        field: 'id',
        headerName: 'ID',
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'guiDisplayNumber',
        headerName: t('No.'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => (
          <RenderValueCell {...params} displayZero={true} />
        ),
        renderEditCell: (params) => <EditNumberCell {...params} label="No." />,
      },
      {
        field: 'name',
        headerName: t('Name'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 2,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditStringCell {...params} label="Name" />,
      },
      {
        field: 'type',
        headerName: t('Type'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => {
          if (params.row.isNew) {
            return <EditTypeCell {...params} />;
          }
          return <RenderNonEditableCell {...params} />;
        },
      },
      {
        field: 'jph',
        headerName: t('JPH'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditNumberCell {...params} label="JPH" />,
      },
      {
        field: 'inventory',
        headerName: t('Inventory'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNumberCell {...params} label="Inventory" />
        ),
      },
      {
        field: 'allCPs',
        headerName: t('AllCPs'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 2,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderAllCPsCell,
        renderEditCell: (params) => {
          if (params.api.getCellValue(params.id, 'type') !== 'VT') {
            return <EditPlanCPCell {...params} />;
          } else {
            return <div></div>;
          }
        },
      },
      {
        field: 'virtualVehicleClasses',
        headerName: t('vVehClass'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 2,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderStackCell,
        renderEditCell: (params) => <EditVirtualVehicleClassCell {...params} />,
      },
      {
        field: 'sched',
        headerName: t('Sched'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        sortComparator: (v1, v2) =>
          v1 === v2 ? 0 : v1 === true ? -1 : !v1 ? 1 : !v2 ? -1 : 0,
        renderCell: (params) => <RenderSchedCell {...params} />,
        renderEditCell: (params) => {
          const sectionType = params.api.getCellValue(params.id, 'type');
          if (params.row.isNew && !['VT', 'SL'].includes(sectionType)) {
            return <EditSchedCell {...params} />;
          } else {
            return <RenderNonEditableCell {...params} />;
          }
        },
      },
      {
        field: 'line',
        headerName: t('Line'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 2,
        editable: true,
        groupingValueGetter: (_, row) => row.line?.name || '',
        filterOperators: getCustomFilterComparator,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => {
          if (params.api.getCellValue(params.id, 'sched')) {
            return (
              <EditNameIdDropdownCell
                {...params}
                options={params.additionalData.baender}
                label="Line"
              />
            );
          } else {
            return <div></div>;
          }
        },
      },
      {
        field: 'predecessors',
        headerName: t('Predecessors'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 4,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderPredecessorsCell,
        renderEditCell: (params) => <EditPredecessorsCell {...params} />,
      },
      {
        field: 'ctBackpacks',
        headerName: t('CTBackpacks'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 3,
        editable: true,
        filterOperators: getCustomFilterComparator,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderStackCell,
        renderEditCell: (params) => {
          if (params.api.getCellValue(params.id, 'type') !== 'VT') {
            return <EditCTBackpacksCell {...params} label="CTBackpacks" />;
          } else {
            return <div></div>;
          }
        },
      },
      {
        field: 'density',
        headerName: t('Density'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 3,
        editable: true,
        filterOperators: getCustomFilterComparator,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => {
          if (params.api.getCellValue(params.id, 'type') !== 'VT') {
            return (
              <EditNameIdDropdownCell
                {...params}
                includeEmptyValue={true}
                options={params.additionalData.densities}
                label="Density"
              />
            );
          } else {
            return <div></div>;
          }
        },
      },
    ],
    hiddenFields: ['id'],
    initialSort: [{ field: 'guiDisplayNumber', sort: 'asc' }],
    endpoint: 'section',
    identifierKey: 'name',
    i18nKey: 'Section',
    defaults: {
      guiDisplayNumber: 0,
      name: '',
      type: '',
      jph: '',
      inventory: '',
      planCP: '',
      vVehClass: '',
      sched: '',
      predecessors: '',
      vehicleClass: '',
      additionalInventory: 0,
      ctBackpacks: '',
      density: '',
    },
  },
  lines: {
    columns: [
      {
        field: 'id',
        headerName: t('ID'),
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'name',
        headerName: t('Name'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditStringCell {...params} label="Name" />,
      },
      {
        field: 'dueCP',
        headerName: t('DueCP'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterOperators: getCustomFilterComparator,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNameIdCell {...params} label="DueCP" />
        ),
      },
      {
        field: 'vPlanCP',
        headerName: t('vPlanCP'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterOperators: getCustomFilterComparator,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNameIdCell {...params} label="vPlanCP" />
        ),
      },
      {
        field: 'vDueCP',
        headerName: t('vDueCP'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterOperators: getCustomFilterComparator,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNameIdCell {...params} label="vDueCP" />
        ),
      },
      {
        field: 'dfzExtension',
        headerName: t('DfzExtension'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        renderCell: RenderValueCell,
        filterOperators: getCustomFilterComparator,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderEditCell: (params) => (
          <EditNumberCell {...params} label="DfzExtension" />
        ),
      },
    ],
    initialSort: [{ field: 'name', sort: 'asc' }],
    hiddenFields: ['id'],
    endpoint: 'line',
    identifierKey: 'name',
    i18nKey: 'Line',
    defaults: {
      name: '',
      dueCP: '',
      vPlanCP: '',
      vDueCP: '',
      dfzExtension: 0,
    },
  },
  shifts: {
    columns: [
      {
        field: 'id',
        headerName: t('ID'),
        headerClassName: 'pfm-theme--columnHeaders',
        editable: false,
      },
      {
        field: 'name',
        headerName: t('Name'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditStringCell {...params} label="Name" />,
      },
      {
        field: 'workingHours',
        headerName: t('WorkingHours'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderStackCell,
        renderEditCell: (params) => <EditWorkingHoursCell {...params} />,
      },
    ],
    hiddenFields: ['id'],
    endpoint: 'shift',
    identifierKey: 'name',
    i18nKey: 'Shift',
    defaults: {
      name: '',
      workingHours: '',
    },
  },
  worktime: {
    columns: [
      {
        field: 'id',
        headerName: t('ID'),
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'name',
        headerName: t('Name'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditStringCell {...params} label="Name" />,
      },
      {
        field: 'startTime',
        headerName: t('Start'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderTimeCell,
        renderEditCell: (params) => <EditTimeCell {...params} label="Start" />,
      },
      {
        field: 'endTime',
        headerName: t('End'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderTimeCell,
        renderEditCell: (params) => <EditTimeCell {...params} label="End" />,
      },
    ],
    hiddenFields: ['id'],
    endpoint: 'worktime',
    identifierKey: 'name',
    i18nKey: 'Worktime',
    defaults: {
      name: '',
      start: '',
      end: '',
    },
  },
  ctbackpacks: {
    columns: [
      {
        field: 'id',
        headerName: t('ID'),
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'name',
        headerName: t('Name'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditStringCell {...params} label="Name" />,
      },
      {
        field: 'vehicleRule',
        headerName: t('VehicleRule'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterOperators: getCustomFilterComparator,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditVehicleRuleCell {...params} />,
      },
      {
        field: 'subset',
        headerName: t('SubsetPercent'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNumberCell {...params} label="SubsetPercent" />
        ),
      },
      {
        field: 'ctBackpack',
        headerName: t('CTBackpack'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNumberCell {...params} label="CTBackpack" />
        ),
      },
      {
        field: 'pcc',
        headerName: t('PCC'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditPccCell {...params} />,
      },
      {
        field: 'validFrom',
        headerName: t('ValidFrom'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => <RenderDateCell {...params} />,
        renderEditCell: (params) => (
          <EditDateCell {...params} label="ValidFrom" />
        ),
      },
      {
        field: 'validTo',
        headerName: t('ValidTo'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => <RenderDateCell {...params} />,
        renderEditCell: (params) => (
          <EditDateCell {...params} label="ValidTo" />
        ),
      },
    ],
    hiddenFields: ['id'],
    additionalDataUrl: UrlProvider.getPlantControlCodeUrl(),
    endpoint: 'taktrucksack',
    identifierKey: 'name',
    i18nKey: 'CTBackpack',
    defaults: {
      name: '',
      vehicleRule: '',
      subsetPercent: 0,
      cTBackpack: '',
      pCC: '',
      validFrom: '',
      validTo: '',
    },
  },
  vehicleclasses: {
    columns: [
      {
        field: 'id',
        headerName: t('ID'),
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'name',
        headerName: t('Name'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditStringCell {...params} label="Name" />,
      },
      {
        field: 'priority',
        headerName: t('Priority'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNumberCell {...params} decimalPlaces={0} label="Priority" />
        ),
      },
      {
        field: 'vehicleRule',
        headerName: t('VehicleRule'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterOperators: getCustomFilterComparator,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditVehicleRuleCell {...params} />,
      },
    ],
    hiddenFields: ['id'],
    endpoint: 'vehiclecategory',
    identifierKey: 'name',
    i18nKey: 'VehicleClass',
    defaults: {
      name: '',
      priority: undefined,
      vehicleRule: '',
    },
  },
  vehiclerules: {
    columns: [
      {
        ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
        headerClassName: 'pfm-theme--columnHeaders',
        maxWidth: 10,
        headerName: t(''),
        renderHeader: (params) => (
          <StyledHeader>
            <span>{params.colDef.headerName}</span>
          </StyledHeader>
        ),
      },
      {
        field: 'id',
        headerName: t('ID'),
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'name',
        headerName: t('Name'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 2,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditStringCell {...params} label="Name" />,
      },
      {
        field: 'partialRuleId',
        headerName: t('PartialRuleID'),
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'partialRuleName',
        headerName: t('PartialRuleName'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 2,
        editable: true,
        filterable: false,
        groupable: false,
        aggregable: false,
        sortable: false,
        renderCell: (params) => (
          <RenderPartialRules {...params} partialRuleCell="name" />
        ),
        renderEditCell: (params) => {
          if (params.row.isNew) {
            return <EditStringCell {...params} label="PartialRuleName" />;
          } else {
            return <div></div>;
          }
        },
      },
      {
        field: 'model',
        headerName: t('Model'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterable: false,
        groupable: false,
        aggregable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => (
          <RenderPartialRules {...params} partialRuleCell="model" />
        ),
        renderEditCell: (params) => {
          if (params.row.isNew) {
            return <EditStringCell {...params} label="Model" />;
          } else {
            return <div></div>;
          }
        },
      },
      {
        field: 'productionCode',
        headerName: t('ProductionCode'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterable: false,
        groupable: false,
        aggregable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => (
          <RenderPartialRules {...params} partialRuleCell="productionCode" />
        ),
        renderEditCell: (params) => {
          if (params.row.isNew) {
            return <EditStringCell {...params} label="ProductionCode" />;
          } else {
            return <div></div>;
          }
        },
      },
      {
        field: 'asfCode',
        headerName: t('ASFCode'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterable: false,
        groupable: false,
        aggregable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => (
          <RenderPartialRules {...params} partialRuleCell="asfCode" />
        ),
        renderEditCell: (params) => {
          if (params.row.isNew) {
            return <EditStringCell {...params} label="ASFCode" />;
          } else {
            return <div></div>;
          }
        },
      },
      {
        field: 'productionNumber',
        headerName: t('ProdNr'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterable: false,
        groupable: false,
        aggregable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => (
          <RenderPartialRules {...params} partialRuleCell="productionNumber" />
        ),
        renderEditCell: (params) => {
          if (params.row.isNew) {
            return <EditStringCell {...params} label="ProdNr" />;
          } else {
            return <div></div>;
          }
        },
      },
      {
        field: 'vehicleNumber',
        headerName: t('VehNr'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterable: false,
        groupable: false,
        aggregable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => (
          <RenderPartialRules {...params} partialRuleCell="vehicleNumber" />
        ),
        renderEditCell: (params) => {
          if (params.row.isNew) {
            return <EditStringCell {...params} label="VehicleNr" />;
          } else {
            return <div></div>;
          }
        },
      },
      {
        field: 'extendedFilter',
        headerName: t('ExtendedFilter'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 4,
        editable: true,
        filterable: false,
        groupable: false,
        aggregable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => (
          <RenderPartialRules {...params} partialRuleCell="extendedFilter" />
        ),
        renderEditCell: (params) => {
          if (params.row.isNew) {
            return <EditStringCell {...params} label="ExtendedFilter" />;
          } else {
            return <div></div>;
          }
        },
      },
    ],
    hiddenFields: ['id', 'partialRuleId'],
    initialSort: [{ field: 'name', sort: 'asc' }],
    endpoint: 'vehiclerule',
    identifierKey: 'name',
    i18nKey: 'VehicleRule',
    defaults: {
      name: '',
      partialRuleName: '',
      model: '',
      productionCode: '',
      asfCode: '',
      productionNumber: '',
      vehicleNumber: '',
      extendedFilter: '',
    },
    subEntityConfig: {
      entityType: 'partialrules',
      initialSort: [{ field: 'name', sort: 'asc' }],
      parentEndpoint: 'vehiclerule',
      endpoint: 'partialrule',
      columns: [
        {
          field: 'id',
          headerName: t('ID'),
          headerClassName: 'pfm-theme--columnHeaders',
        },
        {
          field: 'ruleId',
          headerName: t('ruleID'),
          headerClassName: 'pfm-theme--columnHeaders',
        },
        {
          field: 'name',
          headerName: t('Name'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => (
            <EditStringCell {...params} label="Name" />
          ),
        },
        {
          field: 'model',
          headerName: t('Model'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          filterOperators: getCustomFilterComparator,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => (
            <EditStringCell {...params} label="Model" />
          ),
        },
        {
          field: 'productionCode',
          headerName: t('ProductionCode'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => (
            <EditStringCell {...params} label="ProductionCode" />
          ),
        },
        {
          field: 'asfCode',
          headerName: t('ASFCode'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => (
            <EditStringCell {...params} label="ASFCode" />
          ),
        },
        {
          field: 'productionNumber',
          headerName: t('ProdNr'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => (
            <EditStringCell {...params} label="ProdNr" />
          ),
        },
        {
          field: 'vehicleNumber',
          headerName: t('VehNr'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => (
            <EditStringCell {...params} label="VehNr" />
          ),
        },
        {
          field: 'extendedFilter',
          headerName: t('ExtendedFilter'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => (
            <EditStringCell {...params} label="ExtendedFilter" />
          ),
        },
      ],
      identifierKey: 'name',
      hiddenFields: ['id', 'ruleId'],
      i18nKey: 'PartialRule',
      defaults: {
        name: '',
        ruleId: '',
        model: '',
        productionCode: '',
        asfCode: '',
        productionNumber: '',
        vehicleNumber: '',
        extendedFilter: '',
      },
    },
  },
  densities: {
    columns: [
      {
        field: 'id',
        headerName: t('ID'),
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'name',
        headerName: t('Name'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditStringCell {...params} label="Name" />,
      },
      {
        field: 'vehicleRule',
        headerName: t('VehicleRule'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterOperators: getCustomFilterComparator,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditVehicleRuleCell {...params} />,
      },
      {
        field: 'densityMax',
        headerName: t('DensityMax'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNumberCell {...params} label="DensityMax" />
        ),
      },
      {
        field: 'densityWindow',
        headerName: t('DensityWindow'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNumberCell {...params} label="DensityWindow" />
        ),
      },
    ],
    hiddenFields: ['id'],
    endpoint: 'density',
    identifierKey: 'name',
    i18nKey: 'Density',
    defaults: {
      name: '',
      vehicleRule: '',
      densityMax: '',
      densityWindow: '',
    },
  },
  capacities: {
    columns: [
      {
        field: 'id',
        headerName: t('ID'),
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'line',
        headerName: t('Line'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        groupingValueGetter: (_, row) => row.line?.name || '',
        filterOperators: getCustomFilterComparator,
        renderCell: RenderValueCell,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderEditCell: (params) => (
          <EditNameIdDropdownCell
            {...params}
            options={params.additionalData.baender}
            label="Line"
          />
        ),
      },
      {
        field: 'date',
        headerName: t('Date'),
        type: 'date',
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => <RenderDateCell {...params} />,
        renderEditCell: (params) => (
          <EditCapaDateCell {...params} label="Date" />
        ),
      },
      {
        field: 'shift',
        headerName: t('Shift'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        groupingValueGetter: (_, row) => row.shift?.name || '',
        filterOperators: getCustomFilterComparator,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNameIdDropdownCell
            {...params}
            options={params.additionalData.schichtarten}
            label="Shift"
          />
        ),
      },
      {
        field: 'capacity',
        headerName: t('Capacity'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => (
          <RenderValueCell {...params} displayZero={true} />
        ),
        renderEditCell: (params) => (
          <EditNumberCell {...params} label="Capacity" />
        ),
      },
      {
        field: 'soaCapacity',
        headerName: t('SOACapacity'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNumberCell {...params} label="SOACapacity" />
        ),
      },
      {
        field: 'ckdCapacity',
        headerName: t('CKDCapacity'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNumberCell {...params} label="CKDCapacity" />
        ),
      },
      {
        field: 'skdCapacity',
        headerName: t('SKDCapacity'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNumberCell {...params} label="SKDCapacity" />
        ),
      },
    ],
    hiddenFields: ['id'],
    endpoint: 'capacity',
    identifierKey: 'line.name',
    additionalIdentifierKey: 'date',
    i18nKey: 'Capacity',
    defaults: {
      line: '',
      date: new Date(),
      shift: '',
      capacity: null,
      soaCapacity: 0,
      ckdCapacity: 0,
      skdCapacity: 0,
    },
  },
  distributions: {
    columns: [
      {
        ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
        headerClassName: 'pfm-theme--columnHeaders',
        maxWidth: 10,
        headerName: t(''),
        renderHeader: (params) => (
          <StyledHeader>
            <span>{params.colDef.headerName}</span>
          </StyledHeader>
        ),
      },
      {
        field: 'id',
        headerName: t('ID'),
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'section',
        headerName: t('Section'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterOperators: getCustomFilterComparator,
        groupingValueGetter: (_, row) => row.section?.name || '',
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => {
          if (params.row.isNew) {
            return <EditSectionDropdownCell {...params} label="Section" />;
          } else {
            return <RenderNonEditableCell {...params} />;
          }
        },
      },
      {
        field: 'vehicleClass',
        headerName: t('VehicleClass'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterOperators: getCustomFilterComparator,
        groupingValueGetter: (_, row) => row.vehicleClass?.name || '',
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditVehicleClassDropdownCell {...params} label="VehicleClass" />
        ),
      },
      {
        field: 'predecessor',
        headerName: t('Predecessor'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterOperators: getCustomFilterComparator,
        groupingValueGetter: (_, row) => row.predecessor?.name || '',
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditPredecessorDropdownCell {...params} label="Predecessor" />
        ),
      },
      {
        field: 'date',
        headerName: t('Date'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: false,
        aggregable: false,
        filterable: false,
        groupable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => (
          <RenderQuantities {...params} quantityCell="date" />
        ),
      },
      {
        field: 'lines',
        headerName: t('Lines'),
        headerClassName: 'pfm-theme--columnHeaders',
        editable: false,
        aggregable: false,
        filterable: false,
        groupable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        flex: 1,
        renderCell: (params) => (
          <RenderQuantities
            {...params}
            quantityCell="relevantLinesWithCapacity"
          />
        ),
      },
      {
        field: 'searchWindow',
        headerName: t('SearchWindow'),
        headerClassName: 'pfm-theme--columnHeaders',
        editable: false,
        aggregable: false,
        filterable: false,
        groupable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        flex: 1,
        renderCell: (params) => (
          <RenderQuantities {...params} quantityCell="searchWindow" />
        ),
      },
      {
        field: 'quantity',
        headerName: t('Quantity'),
        headerClassName: 'pfm-theme--columnHeaders',
        editable: false,
        aggregable: false,
        filterable: false,
        groupable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        flex: 1,
        renderCell: (params) => (
          <RenderQuantities {...params} quantityCell="quantity" />
        ),
      },
    ],
    hiddenFields: ['id'],
    endpoint: 'distribution',
    identifierKey: 'section.name',
    additionalIdentifierKey: 'vehicleClass.name',
    i18nKey: 'Distribution',
    defaults: {
      section: '',
      vehicleClass: '',
      predecessor: '',
      date: '',
      lines: '',
      searchWindow: '',
      quantity: '',
    },
    subEntityConfig: {
      entityType: 'quantities',
      initialSort: [{ field: 'date', sort: 'asc' }],
      hiddenFields: ['id'],
      parentEndpoint: 'distribution',
      endpoint: 'quantity',
      identifierKey: 'date',
      i18nKey: 'Quantity',
      defaults: {
        date: '',
        relevantLinesWithCapacity: '',
        searchWindow: '',
        quantity: '',
      },
      columns: [
        {
          field: 'id',
          headerName: t('ID'),
          headerClassName: 'pfm-theme--columnHeaders',
        },
        {
          field: 'date',
          headerName: t('Date'),
          type: 'date',
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: (params) => <RenderDateCell {...params} />,
        },
        {
          field: 'relevantLinesWithCapacity',
          headerName: t('Lines'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          filterOperators: getCustomFilterComparator,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderQuantityStackCell,
        },
        {
          field: 'searchWindow',
          headerName: t('SearchWindow'),
          headerClassName: 'pfm-theme--columnHeaders',
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          flex: 1,
          renderCell: RenderValueCell,
        },
        {
          field: 'quantity',
          headerName: t('Quantity'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => (
            <EditNumberCell {...params} label="Quantity" />
          ),
        },
      ],
    },
  },
  auditcapacities: {
    columns: [
      {
        ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
        headerClassName: 'pfm-theme--columnHeaders',
        maxWidth: 10,
        headerName: t(''),
        renderHeader: (params) => (
          <StyledHeader>
            <span>{params.colDef.headerName}</span>
          </StyledHeader>
        ),
      },
      {
        field: 'id',
        headerName: t('ID'),
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'name',
        headerName: t('Name'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditStringCell {...params} label="Name" />,
      },
      {
        field: 'attribute',
        headerName: t('Attribute'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditStringCell {...params} label="Attribute" />
        ),
      },
      {
        field: 'maxAudits',
        headerName: t('MaxAudits'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNumberCell {...params} label="MaxAudits" />
        ),
      },
      {
        field: 'auditSegment',
        headerName: t('AuditSegment'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNumberCell {...params} label="AuditSegment" />
        ),
      },
      {
        field: 'section',
        headerName: t('Section'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterOperators: getCustomFilterComparator,
        groupingValueGetter: (_, row) => row.section?.name || '',
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditNameIdDropdownCell
            {...params}
            includeEmptyValue={true}
            uniqueSelection={true}
            options={params.additionalData.abschnitte}
            label="Section"
          />
        ),
      },
      {
        field: 'audits',
        headerName: t('Audits'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 2,
        filterable: false,
        aggregable: false,
        groupable: false,
        editable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => <RenderAudits {...params} auditCell="name" />,
      },
      {
        field: 'puCode',
        headerName: t('PUCode'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        filterable: false,
        aggregable: false,
        groupable: false,
        editable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => <RenderAudits {...params} auditCell="puCode" />,
      },
      {
        field: 'vehicleRule',
        headerName: t('VehicleRule'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 2,
        filterable: false,
        aggregable: false,
        groupable: false,
        editable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => (
          <RenderAudits {...params} auditCell="vehicleRule" />
        ),
      },
      {
        field: 'auditQuota',
        headerName: t('AuditQuotaPercent'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        filterable: false,
        aggregable: false,
        groupable: false,
        editable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => (
          <RenderAudits {...params} auditCell="auditQuota" />
        ),
      },
      {
        field: 'ctBackpack',
        headerName: t('CTBackpack'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        filterable: false,
        aggregable: false,
        groupable: false,
        editable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => (
          <RenderAudits {...params} auditCell="ctBackpack" />
        ),
      },
      {
        field: 'pcc',
        headerName: t('PCC'),
        headerClassName: 'pfm-theme--columnHeaders',
        filterable: false,
        aggregable: false,
        groupable: false,
        editable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        flex: 1,
        renderCell: (params) => <RenderAudits {...params} auditCell="pcc" />,
      },
      {
        field: 'manualAuditDebt',
        headerName: t('ManualAuditDebt'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        filterable: false,
        aggregable: false,
        groupable: false,
        editable: false,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: (params) => (
          <RenderAudits {...params} auditCell="manualAuditDebt" />
        ),
      },
    ],
    hiddenFields: ['id'],
    endpoint: 'auditcapacity',
    identifierKey: 'name',
    i18nKey: 'AuditCapacity',
    defaults: {
      name: '',
      attribute: '',
      maxAudits: 0,
      auditSegment: '',
      section: '',
      audits: [],
      puCode: '',
      vehicleRule: '',
      auditQuotaPercent: 0,
      cTBackpack: '',
      pcc: '',
      manualAuditDebt: 0,
    },
    subEntityConfig: {
      entityType: 'audits',
      additionalDataUrl: UrlProvider.getPlantControlCodeUrl(),
      parentEndpoint: 'auditcapacity',
      endpoint: 'audit',
      columns: [
        {
          field: 'id',
          headerName: t('ID'),
          headerClassName: 'pfm-theme--columnHeaders',
        },
        {
          field: 'auditCapacityId',
          headerName: t('ID'),
          headerClassName: 'pfm-theme--columnHeaders',
        },
        {
          field: 'name',
          headerName: t('Name'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 2,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => (
            <EditStringCell {...params} label="Name" />
          ),
        },
        {
          field: 'puCode',
          headerName: t('PUCode'),
          headerClassName: 'pfm-theme--columnHeaders',
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => <RenderNonEditableCell {...params} />,
        },
        {
          field: 'vehicleRule',
          headerName: t('VehicleRule'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 2,
          editable: true,
          filterOperators: getCustomFilterComparator,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => (
            <EditNameIdDropdownCell
              {...params}
              label="VehicleRule"
              options={params.additionalData.fahrzeugregeln}
            />
          ),
        },
        {
          field: 'auditQuota',
          headerName: t('AuditQuotaPercent'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => (
            <EditNumberCell {...params} label="AuditQuotaPercent" />
          ),
        },
        {
          field: 'ctBackpack',
          headerName: t('CTBackpack'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => (
            <EditNumberCell {...params} label="CTBackpack" />
          ),
        },
        {
          field: 'pcc',
          headerName: t('PCC'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => {
            return <EditPccCell {...params} label="PCC" />;
          },
        },
        {
          field: 'calculatedAuditDebt',
          headerName: t('CalculatedAuditDebt'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => <RenderNonEditableCell {...params} />,
        },
        {
          field: 'manualAuditDebt',
          headerName: t('ManualAuditDebt'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: RenderValueCell,
          renderEditCell: (params) => (
            <EditNumberCell
              {...params}
              label="ManualAuditDebt"
              disabled={!params.row.cellsEditable}
            />
          ),
        },
        {
          field: 'validFrom',
          type: 'dateTime',
          headerName: t('ValidFrom'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: (params) => <RenderDateTimeCell {...params} />,
          renderEditCell: (params) => (
            <EditDateTimeCell
              {...params}
              disabled={!params.row.cellsEditable}
              label="ValidFrom"
            />
          ),
        },
        {
          field: 'validTo',
          type: 'dateTime',
          headerName: t('ValidTo'),
          headerClassName: 'pfm-theme--columnHeaders',
          flex: 1,
          editable: true,
          getSortComparator: (sortDirection: GridSortDirection) =>
            getCustomSortComparator(sortDirection),
          renderCell: (params) => <RenderDateTimeCell {...params} />,
          renderEditCell: (params) => (
            <EditDateTimeCell
              {...params}
              disabled={!params.row.cellsEditable}
              label="ValidTo"
            />
          ),
        },
      ],
      identifierKey: 'name',
      i18nKey: 'Audit',
      hiddenFields: ['id', 'auditCapacityId'],
      initialSort: [{ field: 'name', sort: 'asc' }],
      defaults: {
        name: '',
        auditCapacityId: '',
        lines: '',
        vehicleRule: '',
        auditQuota: '',
        ctBackpack: '',
        pcc: '',
        manualAuditDebt: '',
        validFrom: '',
        validTo: '',
      },
    },
  },
  roles: {
    columns: [
      {
        field: 'id',
        headerName: t('ID'),
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'role',
        headerName: t('Role'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditStringCell {...params} label="Role" />,
      },
      {
        field: 'privileges',
        headerName: t('Privileges'),
        headerClassName: 'pfm-theme--columnHeaders',
        filterOperators: getCustomFilterComparator,
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderStackCell,
        renderEditCell: (params) => (
          <EditPrivilegesCell {...params} label="Privilege" />
        ),
      },
      {
        field: 'description',
        headerName: t('Description'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditStringCell {...params} label="Description" />
        ),
      },
    ],
    hiddenFields: ['id'],
    endpoint: 'role',
    identifierKey: 'name',
    i18nKey: 'Role',
    defaults: {
      role: '',
      privilege: '',
      description: '',
    },
  },
  users: {
    columns: [
      {
        field: 'id',
        headerName: t('ID'),
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'name',
        headerName: t('User'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => <EditStringCell {...params} label="Name" />,
      },
      {
        field: 'description',
        headerName: t('Description'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderValueCell,
        renderEditCell: (params) => (
          <EditStringCell {...params} label="Description" />
        ),
      },
      {
        field: 'roles',
        headerName: t('Roles'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        editable: true,
        filterOperators: getCustomFilterComparator,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
        renderCell: RenderStackCell,
        renderEditCell: (params) => <EditRolesCell {...params} label="Role" />,
      },
    ],
    hiddenFields: ['id'],
    initialSort: [{ field: 'name', sort: 'asc' }],
    endpoint: 'user',
    identifierKey: 'name',
    i18nKey: 'User',
    defaults: {
      name: '',
      description: '',
      roles: [],
    },
  },
  filedownload: {
    columns: [
      {
        field: 'id',
        headerName: t('ID'),
        headerClassName: 'pfm-theme--columnHeaders',
      },
      {
        field: 'filename',
        headerName: t('Filename'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
      },
      {
        field: 'filetype',
        headerName: t('Filetype'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
      },
      {
        field: 'creationDate',
        type: 'dateTime',
        headerName: t('CreationDate'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        valueFormatter: (value) => formatDateTime(value),
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
      },
      {
        field: 'user',
        headerName: t('User'),
        headerClassName: 'pfm-theme--columnHeaders',
        flex: 1,
        getSortComparator: (sortDirection: GridSortDirection) =>
          getCustomSortComparator(sortDirection),
      },
    ],
    hiddenFields: ['id'],
    initialSort: [{ field: 'creationDate', sort: 'desc' }],
    endpoint: 'files',
    identifierKey: 'filename',
    i18nKey: 'File',
    defaults: {
      filename: '',
      filetype: '',
      creationDate: '',
      user: '',
    },
  },
};

export default entityConfig;
