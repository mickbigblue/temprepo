import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from '../../hooks/useRouter';
import ITile from '../../interfaces/ITile';

interface TileProps {
  tileData: ITile;
}

const Tile = ({ tileData }: TileProps) => {
  const { id, target, title, icon } = tileData;
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  return (
    <Grid item xs={12} sm={6} md={3} lg={3} key={id}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flex: '1 0 auto',
          color: theme.palette.secondary.main,
          maxWidth: 345,
          m: 'auto',
        }}
      >
        <CardActionArea
          onClick={() => router.navigate(target)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            flexDirection: 'column',
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              flexGrow: 2,
              justifyContent: 'center',
            }}
          >
            {icon}
            <Typography
              variant="h6"
              align="center"
              sx={{
                fontWeight: 500,
                fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                whiteSpace: 'normal',
                hyphens: 'auto',
              }}
            >
              {t(title)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default Tile;
