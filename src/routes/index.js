import Login from '@/containers/Login';
import PrivateRoute from '@/containers/Routes/privateRoute';
import PublicRoute from '@/containers/Routes/publicRoute';
import React from 'react';
import Home from '@/containers/Home';
import NotFound from '@/components/NotFound';

const routes = [
  <PrivateRoute key="HomeComponent" path="/" component={Home} exact />,
  <PublicRoute
    key="LoginComponent"
    path="/login"
    component={Login}
    exact
    restricted
  />,
  <PublicRoute
    key="NotFoundComponent"
    path="/*"
    component={NotFound}
    exact
    restricted={false}
  />,
];

export default routes;
