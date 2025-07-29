import { GridRenderEditCellParams } from '@mui/x-data-grid-premium';
import EditSingleValueCell from './EditSingleValueCell';

const EditStringCell = (props: GridRenderEditCellParams) => {
  return <EditSingleValueCell {...props} />;
};

export default EditStringCell;
