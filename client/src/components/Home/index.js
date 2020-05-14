/* eslint-disable react/prop-types */
import React from 'react';
import { timelineAction } from '@/redux/timeline/timelineAction';
import { StyledContainer } from './styles';
import Timeline from '../Timeline';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    const { dispatch } = props;
    dispatch(timelineAction());
  }

  render() {
    const { timelines, dispatch, hasMore } = this.props;
    return (
      <StyledContainer>
        {timelines.length > 0 && <Timeline data={timelines} dispatch={dispatch} hasMore={hasMore} />}
      </StyledContainer>
    );
  }
}
