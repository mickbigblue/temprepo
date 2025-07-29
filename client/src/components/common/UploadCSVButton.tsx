import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import SmallDropZone from '@rpldy/upload-drop-zone';
import { useRequestPreSend, useUploadyContext } from '@rpldy/uploady';
import { format } from 'date-fns';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSeparatorContext } from '../../contexts/SeparatorContext';
import { useSnackbarContext } from '../../contexts/SnackbarContext';
import { useRestApi } from '../../hooks/useRestApi';
import { NameIdRecord } from '../../interfaces/NameIdRecord';
import { UrlProvider } from '../../services/utils/UrlProvider';
import { de, enUS } from 'date-fns/locale';

interface UploadCSVButtonProps {
  additionalData: { [key: string]: NameIdRecord[] };
  entityType: 'capacities' | 'quantities';
  parentId?: number;
}

const UploadCSVButton: React.FC<UploadCSVButtonProps> = memo(
  ({ additionalData, entityType, parentId }) => {
    const { t, i18n } = useTranslation();
    const { separator } = useSeparatorContext();
    const { getOctet } = useRestApi();
    const { openSnackbar } = useSnackbarContext();
    const uploadyContext = useUploadyContext();
    const [uploadLine, setUploadLine] = useState<string>('');
    const [uploadStartDate, setUploadStartDate] = useState<Date | null>(
      new Date()
    );
    const [uploadEndDate, setUploadEndDate] = useState<Date | null>(new Date());

    useEffect(() => {
      if (
        uploadLine === '' &&
        Object.keys(additionalData).length > 0 &&
        additionalData.baender
      ) {
        setUploadLine(additionalData.baender[0].id!.toString());
      }
    }, [additionalData, uploadLine]);

    const dateFormat = i18n.language.startsWith('de')
      ? 'dd.MM.yyyy'
      : 'MM-dd-yyyy';

    const locale = i18n.language.startsWith('de') ? de : enUS;

    const baseURL =
      entityType === 'capacities'
        ? UrlProvider.getBasedataEndpointUrl('capacity') + '/import'
        : UrlProvider.getBasedataEndpointUrl(
            'distribution',
            parentId,
            'quantity'
          ) + '/import';

    const exportURL =
      entityType === 'quantities'
        ? `${UrlProvider.getBasedataEndpointUrl('distribution', parentId, 'quantity')}/export?separator=${encodeURIComponent(separator)}`
        : '';

    const inputFieldName =
      entityType === 'capacities' ? 'capaCSV' : 'quantityCSV';

    useEffect(() => {
      // Dev mode header settings
      const headers: Record<string, string> = {};
      if (
        process.env.NODE_ENV === 'development' &&
        process.env.REACT_APP_PFM_KEY
      ) {
        headers['user-info'] = `"${process.env.REACT_APP_USER_INFO}"`;
        headers['pfm-key'] = process.env.REACT_APP_PFM_KEY;
      }

      const params: Record<string, string | null> = {
        separator: separator,
      };

      if (entityType === 'capacities' && uploadLine !== '') {
        params.lineId = uploadLine;
      }

      if (
        uploadStartDate instanceof Date &&
        !isNaN(uploadStartDate.getTime()) &&
        uploadEndDate instanceof Date &&
        !isNaN(uploadEndDate.getTime())
      ) {
        params.startDate = format(uploadStartDate, 'yyyy-MM-dd');
        params.endDate = format(uploadEndDate, 'yyyy-MM-dd');
      } else {
        params.startDate = null;
        params.endDate = null;
      }

      uploadyContext.setOptions({
        destination: {
          url: baseURL,
          headers,
          params,
        },
        inputFieldName,
      });
    }, [
      baseURL,
      entityType,
      separator,
      uploadLine,
      uploadStartDate,
      uploadEndDate,
      inputFieldName,
      uploadyContext,
    ]);

    const handleUpload = useCallback(() => {
      if (
        (entityType !== 'capacities' || uploadLine) &&
        uploadStartDate &&
        uploadEndDate
      ) {
        uploadyContext.showFileUpload();
      } else {
        openSnackbar(t('UploadFieldsMissing'), 'error');
      }
    }, [
      t,
      uploadLine,
      openSnackbar,
      entityType,
      uploadStartDate,
      uploadEndDate,
      uploadyContext,
    ]);

    const handleExport = async () => {
      const resp = await getOctet(exportURL, true);
      if (resp.statusCode === 200) {
        const win = window.open(resp.url);
        if (win !== null) {
          win.onunload = async () => {
            if (!win.closed) {
              win.close();
            }
          };
        }
      }
    };

    // Intercept upload and validate before sending
    useRequestPreSend((_) => {
      // Validation Logic
      if (
        (entityType !== 'capacities' || uploadLine) &&
        uploadStartDate &&
        uploadEndDate
      ) {
        // Valid, allow upload
        return true;
      } else {
        // Invalid, prevent upload and show snackbar
        openSnackbar(t('UploadFieldsMissing'), 'error');
        return false; // Returning null cancels the upload
      }
    });

    return (
      <Box display="flex" flexDirection="row" gap={2}>
        {entityType === 'capacities' && (
          <FormControl fullWidth>
            <InputLabel id="line-select-label">{t('Line')}</InputLabel>
            <Select
              labelId="line-select-label"
              value={additionalData.baender ? uploadLine : ''}
              label={t('Line')}
              onChange={(e) => setUploadLine(e.target.value)}
            >
              {additionalData.baender?.map((line) => (
                <MenuItem key={line.id} value={line.id}>
                  {line.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={locale}
        >
          <DatePicker
            label={t('StartDate')}
            value={uploadStartDate}
            onChange={(newValue) => {
              setUploadStartDate(newValue);
            }}
            format={dateFormat}
            sx={{ minWidth: '200px' }}
          />
        </LocalizationProvider>

        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={locale}
        >
          <DatePicker
            label={t('EndDate')}
            value={uploadEndDate}
            onChange={(newValue) => setUploadEndDate(newValue)}
            format={dateFormat}
            sx={{ minWidth: '200px' }}
          />
        </LocalizationProvider>
        <Button
          color="primary"
          variant="contained"
          onClick={handleUpload}
          style={{
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'row',
            minWidth: '200px',
            height: '56px',
            lineHeight: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid black',
            verticalAlign: 'bottom',
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
        >
          {t('UploadFile')}
        </Button>
        {entityType === 'quantities' && (
          <Button
            style={{
              marginBottom: '16px',
              display: 'flex',
              flexDirection: 'row',
              minWidth: '200px',
              height: '56px',
              lineHeight: '20px',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid black',
              verticalAlign: 'bottom',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
            variant="contained"
            color="primary"
            onClick={handleExport}
          >
            {t('ExportQuantities')}
          </Button>
        )}

        <SmallDropZone autoUpload={true} onDragOverClassName="drag-over">
          <div
            id="drag-text"
            style={{
              marginBottom: '16px',
              minWidth: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid black',
              height: '54px',
              lineHeight: '100px',
              verticalAlign: 'bottom',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
          >
            <Typography
              color="initial"
              variant="subtitle1"
              display="inline"
              align="justify"
            >
              {t('CsvDropZone')}
            </Typography>
            <SystemUpdateAltIcon fontSize="medium" />
          </div>
        </SmallDropZone>
      </Box>
    );
  }
);

export default React.memo(UploadCSVButton);
