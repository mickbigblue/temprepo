import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import Draggable from 'react-draggable';
import { useTranslation } from 'react-i18next';
import { useVersionContext } from '../../contexts/VersionContext';

interface DraggableDialogProps extends DialogProps {
  onClose: (
    event: {},
    reason: 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick'
  ) => void;
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function DraggableAboutDialog(props: DraggableDialogProps) {
  // Destructuring custom props and rest props of Dialog
  let { onClose, ...dialogProps } = props;

  const { t, i18n } = useTranslation();

  const now = new Date();
  const locales = { en: enUS, de: de };
  const versionInfo = useVersionContext().versionInfo;

  // Check if the current i18n.language is a key in the locales object, and if not, default to 'enUS'
  const dateFnsLocale = locales.hasOwnProperty(i18n.language)
    ? locales[i18n.language as keyof typeof locales]
    : enUS;

  const dateFormatString = t('DateTimeFormat');

  // Using date-fns to format the date according to the current language's format string
  const formattedDateTime = format(now, dateFormatString, {
    locale: dateFnsLocale,
  });

  // Filter out the 'objType' key when mapping
  const filteredVersionInfo = Object.entries(versionInfo).filter(
    ([key, _]) => key !== 'objType'
  );

  return (
    <Dialog {...dialogProps} onClose={onClose} PaperComponent={PaperComponent}>
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        {t('VersionInfo')} ({formattedDateTime})
      </DialogTitle>
      <DialogContent>
        <DialogContentText component="div">
          <TableContainer component={Paper}>
            <Table aria-label="version info">
              <TableBody>
                {filteredVersionInfo.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell component="th" scope="row">
                      {t(key)}
                    </TableCell>
                    <TableCell align="right">{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => onClose({}, 'closeButtonClick')}>
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DraggableAboutDialog;
