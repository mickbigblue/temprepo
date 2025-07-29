import AccountCircle from '@mui/icons-material/AccountCircle';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import {
  AppBar,
  Breadcrumbs,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  Link,
  Menu,
  MenuItem,
  Select,
  Slide,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEnvironmentTypeContext } from '../../contexts/EnvironmentTypeContext';
import { usePaginationContext } from '../../contexts/PaginationContext';
import { usePlantContext } from '../../contexts/PlantContext';
import { useSeparatorContext } from '../../contexts/SeparatorContext';
import { useUserContext } from '../../contexts/UserContext';
import { useVersionContext } from '../../contexts/VersionContext';
import { useRestApi } from '../../hooks/useRestApi';
import { useRouter } from '../../hooks/useRouter';
import { CommonUtils } from '../../services/utils/CommonUtils';
import { UrlProvider } from '../../services/utils/UrlProvider';
import DraggableAboutDialog from './DraggableAboutDialog';

function HideOnScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function HeaderBar() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { get } = useRestApi();

  const environmentType = useEnvironmentTypeContext();
  const versionContext = useVersionContext();
  const { separator, setSeparator } = useSeparatorContext();
  const { pageSize, setPageSize } = usePaginationContext();
  const user = useUserContext();
  const plant = usePlantContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [crumbs, setCrumbs] = useState<string[]>([]);

  const [isAboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [isAboutDialogFixed, setAboutDialogFixed] = useState(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    const routeUrl = router.pathname;
    const parts = routeUrl.split('/').filter((elem: string) => elem !== '');
    setCrumbs(parts);
  }, [router.pathname]);

  let envTypeKey: string;
  switch (environmentType) {
    case 'production':
      envTypeKey = 'EnvironmentTypeProduction';
      break;
    case 'test':
      envTypeKey = 'EnvironmentTypeTest';
      break;
    default:
      envTypeKey = 'EnvironmentTypeUnknown';
      break;
  }

  const getRoute = () => {
    const capitalizedRouteName = CommonUtils.capitalize(
      router.getLastRouteElement()
    );
    const finalDisplay =
      capitalizedRouteName === 'Home'
        ? capitalizedRouteName
        : t(capitalizedRouteName);
    return finalDisplay;
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const logoutRedirectUrl = await UrlProvider.getLogoutRedirectUrl();
    sessionStorage.clear();
    await get(UrlProvider.getLogoutUrl(), true);
    window.location.replace(logoutRedirectUrl);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = Number(e.target.value);
    setPageSize(newPageSize);
  };

  const handleOpenAboutInfo = () => {
    handleCloseMenu();
    setAboutDialogOpen(true);
  };

  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

  return (
    <>
      <HideOnScroll>
        <AppBar position="fixed" style={{ marginBottom: 30 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => router.navigate(-1)}
              style={{
                borderRight: '0.1em solid white',
                marginRight: theme.spacing(1),
              }}
              size="large"
            >
              <ArrowBackIosIcon style={{ width: '25px', height: '25px' }} />
            </IconButton>

            <IconButton
              color="inherit"
              onClick={() => router.navigateToHome()}
              style={{
                borderRight: '0.1em solid white',
                marginRight: theme.spacing(1),
              }}
              size="large"
            >
              <HomeIcon style={{ width: '25px', height: '25px' }} />
            </IconButton>
            <Typography
              variant="h6"
              color="inherit"
              style={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'flex-start',
                marginLeft: '28.5%',
              }}
            >
              PFM (
              {versionContext.versionInfo
                ? versionContext.versionInfo.releaseVersion
                : ''}
              , {t('EnvironmentHeader')}: {t(envTypeKey)}) -{' '}
              {t('PlantAreaHeader')}: {plant ? plant : t('PlantNotFound')} -{' '}
              {getRoute()}
            </Typography>
            <IconButton onClick={handleMenu} color="inherit" size="large">
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleCloseMenu}
            >
              <MenuItem>
                <Typography variant="h5" color="secondary">
                  {user}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ViewColumnIcon style={{ marginRight: '8px' }} />
                <FormControl fullWidth>
                  <InputLabel>Separator</InputLabel>
                  <Select
                    label="Separator"
                    id="separator-select"
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value.charAt(0))}
                    variant="outlined"
                  >
                    <MenuItem
                      value=";"
                      sx={{ fontSize: '1.2rem', padding: '10px 20px' }}
                    >
                      {t('Semicolon')}
                    </MenuItem>
                    <MenuItem
                      value=","
                      sx={{ fontSize: '1.2rem', padding: '10px 20px' }}
                    >
                      {t('Comma')}
                    </MenuItem>
                  </Select>
                </FormControl>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ViewColumnIcon style={{ marginRight: '8px' }} />
                <TextField
                  id="separator-textfield"
                  label={t('PageSize')}
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  variant="outlined"
                />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleOpenAboutInfo}>
                <InfoIcon style={{ marginRight: '8px' }} />
                {t('About')}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAboutDialogFixed}
                      onChange={(e) => setAboutDialogFixed(e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      edge="end"
                      style={{ marginRight: '4px' }}
                    />
                  }
                  label={t('Fixed')}
                  style={{ marginLeft: 'auto' }}
                />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ExitToAppIcon style={{ marginRight: '8px' }} />
                {t('Logout')}
              </MenuItem>
            </Menu>
            <DraggableAboutDialog
              open={isAboutDialogOpen}
              onClose={(
                event: {},
                reason: 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick'
              ) => {
                if (reason === 'backdropClick' && isAboutDialogFixed) {
                  // Prevent closing on backdrop click when fixed is enabled...
                  return;
                }
                // ...allow cosing otherwise
                setAboutDialogOpen(false);
              }}
              hideBackdrop={isAboutDialogFixed}
              disableEnforceFocus={isAboutDialogFixed}
              disableAutoFocus={isAboutDialogFixed}
              disableEscapeKeyDown={isAboutDialogFixed}
              style={{ pointerEvents: isAboutDialogFixed ? 'none' : 'auto' }}
              PaperProps={{
                style: {
                  pointerEvents: 'auto',
                },
              }}
            />
          </Toolbar>
          <Breadcrumbs
            separator=">"
            style={{
              display: 'flex',
              marginLeft: '0.5%',
              marginRight: '0.5%',
              color: theme.palette.secondary.contrastText,
            }}
          >
            <Link color="inherit" onClick={() => router.navigateToHome()}>
              <HomeIcon style={{ width: 30, height: 30, cursor: 'pointer' }} />
            </Link>
            {crumbs.map((crumb, idx) => {
              // We clean the breadcrumb from unwanted query parameters
              const cleanCrumb: string = crumb.split('?')[0];
              const i18nKey = CommonUtils.capitalize(cleanCrumb);
              // If we are on a PartialRules or Quantities or Audits table, we don't want to link it in the breadcrumb
              // because we have no partialRuleId / quantitiesId / auditsId
              if (
                i18nKey === 'Vehiclerules' ||
                i18nKey === 'Distributions' ||
                i18nKey === 'Auditcapacities'
              ) {
                return (
                  <Link
                    key={crumb + idx}
                    color="inherit"
                    style={{ cursor: 'pointer' }}
                    onClick={() => router.navigate(0)}
                  >
                    {t(i18nKey)}
                  </Link>
                );
              } else {
                return (
                  <Link
                    key={crumb + idx}
                    color="inherit"
                    style={{ cursor: 'pointer' }}
                    onClick={() => router.navigate(cleanCrumb)}
                  >
                    {t(i18nKey)}
                  </Link>
                );
              }
            })}
          </Breadcrumbs>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Offset />
    </>
  );
}
