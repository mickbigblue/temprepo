import { Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import React from 'react';
import { UIAudit } from '../../../../../interfaces/Audits';
import RenderValueCell from '../../../../common/renderCell/RenderValueCell';
import RenderDateCell from '../../../../common/renderCell/RenderDateCell';
import { sortByName } from '../../../../../utils/nameIdSort';

interface RenderAuditsProps extends GridRenderCellParams {
  auditCell: keyof UIAudit;
}

const RenderAudits = (props: RenderAuditsProps) => {
  const { auditCell, row } = props;

  if (!row.audits) return null;

  const formatValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return '';
    }

    if (value instanceof Date) {
      const params = { value } as GridRenderCellParams;
      return <RenderDateCell {...params} />;
    }

    // if (Array.isArray(value)) {
    //   return value.map(
    //     (item: LineWithCapacity) => `${item.lineName} (${item.capacity})`
    //   );
    // }

    if (typeof value === 'object') {
      const params = { value } as GridRenderCellParams;
      return <RenderValueCell {...params} />;
    }

    // if (typeof value === 'number') {
    //   const params = { value } as GridRenderCellParams;
    //   return <RenderValueCell {...params} />;
    // }

    return <Typography>{String(value)}</Typography>;
  };

  const sortedAudits = sortByName(row.audits) as UIAudit[];

  return (
    <div>
      {sortedAudits.map((audit, index) => (
        <div key={index} style={{ marginBottom: '8px' }}>
          {formatValue(audit[auditCell])}
        </div>
      ))}
    </div>
  );
};

export default RenderAudits;
