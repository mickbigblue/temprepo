import { Container, Divider, Grid, Typography, useTheme } from '@mui/material';
import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFlexEnabledContext } from '../../contexts/FlexEnabledContext';
import tileData from './tileData';
import { useRouter } from '../../hooks/useRouter';
import ITile from '../../interfaces/ITile';
import Tile from './Tile';

const TileContainer = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const flexEnabled = useFlexEnabledContext();

  const { categories, selectedTiles } = useMemo<{
    categories: string[];
    selectedTiles: ITile[];
  }>(() => {
    const filteredTiles: ITile[] = tileData.filter(
      (tile) =>
        tile.home === router.pathname &&
        (flexEnabled || tile.title !== 'Distributions')
    );
    const categories: string[] = [
      ...new Set(filteredTiles.map((tile) => tile.category)),
    ];

    return { categories, selectedTiles: filteredTiles };
  }, [router.pathname, flexEnabled]);

  return (
    <Container>
      {categories.map((category: string) => (
        <React.Fragment key={category}>
          <Typography
            variant={'h6'}
            sx={{
              color: theme.palette.primary.light,
              m: 1,
              textAlign: 'left',
              mt: 3,
            }}
          >
            {t(category)}
            <Divider sx={{ mb: 1 }} />
          </Typography>
          <Grid container spacing={3} alignItems="center">
            {selectedTiles
              .filter((tile: ITile) => tile.category === category)
              .map((tile: ITile) => (
                <Tile key={tile.id} tileData={tile} />
              ))}
          </Grid>
        </React.Fragment>
      ))}
    </Container>
  );
};

export default TileContainer;
