import { Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  UILineWithCapacity,
  UIQuantity,
} from '../../../../interfaces/Quantities';
import { sortByDate } from '../../../../utils/dateSort';

interface RenderQuantitiesProps extends GridRenderCellParams {
  quantityCell: keyof UIQuantity;
}

const RenderQuantities = (props: RenderQuantitiesProps) => {
  const { quantityCell, row } = props;
  const { i18n } = useTranslation();

  if (!row.quantities) return null;

  const formatValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return '';
    }

    if (value instanceof Date) {
      const locale = i18n.language.startsWith('de') ? de : enUS;
      const dateTimeFormat = i18n.language.startsWith('de')
        ? 'dd.MM.yyyy HH:mm'
        : 'MM-dd-yyyy hh:mm';

      const displayValue = format(new Date(value), dateTimeFormat, { locale });
      // return <RenderDateCell {...params} />;
      return displayValue;
    }

    if (Array.isArray(value)) {
      return value.map(
        (item: UILineWithCapacity) => `${item.name} (${item.capacity})`
      );
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  };

  const sortedQuantities = sortByDate(row.quantities) as UIQuantity[];
  return (
    <div>
      {sortedQuantities.map((quantity, index) => (
        <div key={index} style={{ marginBottom: '8px' }}>
          <Typography>{formatValue(quantity[quantityCell])}</Typography>
        </div>
      ))}
    </div>
  );
};

export default RenderQuantities;
