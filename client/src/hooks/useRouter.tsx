import queryString from 'query-string';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const useRouter = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Return our custom router object
  // Memoize so that a new object is only returned if something changes
  return useMemo(() => {
    const hashPath = location.hash.replace(/^#/, '');
    const pathSegments = location.pathname.split('/').filter(Boolean);

    return {
      navigateToHome: () => navigate('/'),
      back: () => navigate(-1),
      forward: () => navigate(+1),
      isTileContainerPage: pathSegments.length === 1,
      isEntityPage: pathSegments.length === 2,
      getLastRouteElement: () =>
        pathSegments[pathSegments.length - 1] || 'home',
      // For convenience add push(), replace(), pathname at top level
      navigate: navigate,
      pathname: location.pathname,
      hashPath,
      pathSegments: pathSegments,
      // Merge params and parsed query string into single "query" object
      // so that they can be used interchangeably.
      // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
      query: {
        ...queryString.parse(location.search), // Convert string to object
        ...params,
      },
      // Include match, location, history objects so we have
      // access to extra React Router functionality if needed.
      // match,
      location,
      params,
    };
  }, [params, location, navigate]);
};
