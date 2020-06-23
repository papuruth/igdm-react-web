/* eslint-disable react/prop-types */
import {
  timelineAction,
  fetchUserReelAction,
  fetchSuggestedUserAction,
} from '@/redux/timeline/timelineAction';
import React from 'react';
import { Helmet } from 'react-helmet';
import Timeline from '../Timeline';
import { StyledContainer } from './styles';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    const { dispatch, user } = props;
    dispatch(timelineAction());
    dispatch(fetchUserReelAction());
    dispatch(fetchSuggestedUserAction(user.pk));
  }

  render() {
    const {
      timelines,
      dispatch,
      hasMore,
      user,
      greetingsFlag,
      userReels,
      suggestedUser,
    } = this.props;
    return (
      <StyledContainer>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Igram</title>
        </Helmet>
        <Timeline
          data={timelines}
          dispatch={dispatch}
          hasMore={hasMore}
          user={user}
          userReels={userReels}
          suggestedUser={suggestedUser}
          greetingsFlag={greetingsFlag}
        />
      </StyledContainer>
    );
  }
}
