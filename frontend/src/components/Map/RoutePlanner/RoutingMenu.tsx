import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { routeActions } from '../../../store/route';

import LoadRouteActions from './Menu/LoadRouteActions';
import FinalRouteActions from './Menu/FinalRouteActions';
import MainRouteActions from './Menu/MainRouteActions';

const RoutingMenu = () => {
  const dispatch = useAppDispatch();

  const route = useAppSelector((state) => state.route.route);

  const [selectedColor, setSelectedColor] = useState(route.color || 'blue');

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
