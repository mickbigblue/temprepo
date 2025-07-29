import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import TileContainer from '../components/tiles/TileContainer';
import { useRouter } from '../hooks/useRouter';
import EntityRouter from './EntityRouter';
import { EntityType } from '../types';
import HeaderBar from '../components/common/HeaderBar';
import Simulation from '../components/entities/Simulation/Simulation';

const DynamicRouteHandler = () => {
  const router = useRouter();
  if (router.isTileContainerPage) {
    return <TileContainer />;
  } else if (router.isEntityPage) {
    const entityType: EntityType = router.getLastRouteElement() as EntityType;
    return <EntityRouter entityType={entityType} />;
  } else {
    console.error('Unhandled or undefined router accessed:', router.location);
    return <div>404 Page Not Found</div>;
  }
};

const Router = () => {
  return (
    // No need for basename with HashRouter
    //<HashRouter basename={mybasename}>
    <HashRouter>
      <HeaderBar />
      <Routes>
        <Route path="/" element={<TileContainer />} />
        <Route path="/simulateresult" element={<Simulation />} />
        <Route
          path="/filedownload"
          element={<EntityRouter entityType={'filedownload' as EntityType} />}
        />
        <Route path="*" element={<DynamicRouteHandler />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;
