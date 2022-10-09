import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { routeActions } from '../../../store/route';
import { Route } from '../../../models/route.model';

import LoadRouteActions from './Menu/LoadRouteActions';
import FinalRouteActions from './Menu/FinalRouteActions';
import MainRouteActions from './Menu/MainRouteActions';

const RoutingMenu = () => {
  const dispatch = useAppDispatch();

  const route: Route = useAppSelector((state) => state.route.route);

  const [selectedColor, setSelectedColor] = useState<string>(route.color || 'blue');

  // Update route with selected color
  useEffect(() => {
    if (selectedColor !== route.color) {
      dispatch(routeActions.setRoute({ ...route, color: selectedColor }));
    }
  }, [selectedColor]);

  return (
    <div>
      <LoadRouteActions setSelectedColor={setSelectedColor} />
      <MainRouteActions
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
      <FinalRouteActions />
    </div>
  );
};

export default RoutingMenu;
