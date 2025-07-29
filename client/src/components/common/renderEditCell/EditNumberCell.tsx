import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import EditSingleValueCell from './EditSingleValueCell';

interface EditNumberCellProps extends GridRenderEditCellParams {
  decimalPlaces?: number;
}

const EditNumberCell = (props: EditNumberCellProps) => {
  const { decimalPlaces = 99 } = props;

  const validateNumber = (value: string) => {
    const numericValue = Number(value.replace(',', '.'));
    return !isNaN(numericValue);
  };

  return (
    <EditSingleValueCell
      {...props}
      validate={validateNumber}
      decimalPlaces={decimalPlaces}
    />
  );
};

export default EditNumberCell;
