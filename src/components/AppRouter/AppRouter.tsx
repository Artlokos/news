import { Routes, Route, type RouteObject } from 'react-router-dom';
import {routesConfig} from '../../data'

function renderRoutes(routes: RouteObject[]) {
  return routes.map((route, index) => (
    <Route
      key={index}
      path={route.path}
      element={route.element}
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
}

function AppRouter() {
  return <Routes>{renderRoutes(routesConfig)}</Routes>;
}
 
export default AppRouter; 
