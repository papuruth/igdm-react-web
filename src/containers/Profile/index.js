import { connect } from 'react-redux';
import Profile from '@/components/Profile';

const mapStateToProps = (state) => {
  const { user } = state.session;
  const {
    userFeeds,
    userFeedError,
    allFeeds,
    hasMore,
    userInfo,
    friendship,
    highlights,
    suggestedUser,
    searchExactUserInfo,
  } = state.userFeedReducer;
  return {
    user,
    userFeeds,
    userFeedError,
    allFeeds,
    hasMore,
    userInfo,
    friendship,
    highlights,
    suggestedUser,
    searchExactUserInfo,
  };
};

export default connect(mapStateToProps)(Profile);
