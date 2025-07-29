import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import { useTranslation } from 'react-i18next';
import EditNameIdDropdownCell from './EditNameIdDropdownCell';

const EditLineCell: React.FC<GridRenderEditCellParams> = (params) => {
  const { id, api, additionalData } = params;
  const { t } = useTranslation();

  const schedValue = api.getCellValue(id, 'sched');

  if (schedValue === true) {
    return (
      <EditNameIdDropdownCell
        {...params}
        options={additionalData.baender}
        label={t('Lines')}
      />
    );
  }
  return null;
};

export default EditLineCell;
