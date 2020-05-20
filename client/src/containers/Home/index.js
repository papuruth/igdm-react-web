import { connect } from 'react-redux';
import Home from '@/components/Home';

const mapStateToProps = (state) => {
  const { timelines, hasMore } = state.timelineReducer;
  const { user } = state.session;
  const { greetingsFlag } = state.userReducer;

  return {
    timelines,
    hasMore,
    user,
    greetingsFlag,
  };
};

export default connect(mapStateToProps)(Home);
