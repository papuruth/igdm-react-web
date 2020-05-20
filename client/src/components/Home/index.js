/* eslint-disable react/prop-types */
import { timelineAction } from '@/redux/timeline/timelineAction';
import React from 'react';
import Timeline from '../Timeline';
import { StyledContainer } from './styles';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    const { dispatch } = props;
    dispatch(timelineAction());
  }

  render() {
    const { timelines, dispatch, hasMore, user, greetingsFlag } = this.props;
    return (
      <StyledContainer>
        {timelines.length > 0 && (
          <Timeline
            data={timelines}
            dispatch={dispatch}
            hasMore={hasMore}
            user={user}
            greetingsFlag={greetingsFlag}
          />
        )}
      </StyledContainer>
    );
  }
}
