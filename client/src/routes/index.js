import Login from '@/containers/Login';
import PrivateRoute from '@/containers/Routes/privateRoute';
import PublicRoute from '@/containers/Routes/publicRoute';
import React from 'react';
import NotFound from '@/components/NotFound';
import DirectMessage from '@/containers/DirectMessage';
import Home from '@/containers/Home';
import Profile from '@/containers/Profile';
import EditProfile from '@/containers/EditProfile';

const routes = [
  <PrivateRoute key="HomeComponent" path="/" component={Home} exact />,
  <PublicRoute
    key="LoginComponent"
    path="/login"
    component={Login}
    exact
    restricted
  />,
  <PrivateRoute key="DirectMessageComponent" path="/direct/inbox" component={DirectMessage} exact />,
  <PrivateRoute key="DirectMessageComponent" path="/direct/:username" component={DirectMessage} exact />,
  <PrivateRoute key="ProfileComponent" path="/:username" component={Profile} exact />,
  <PrivateRoute key="EditProfileComponent" path="/accounts/*" component={EditProfile} exact />,
  <PublicRoute
    key="NotFoundComponent"
    path="/*"
    component={NotFound}
    exact
    restricted={false}
  />,
];

export default routes;
