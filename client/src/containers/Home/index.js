import { connect } from 'react-redux';
import Home from '@/components/Home';

const mapStateToProps = (state) => {
  const { timelines, hasMore } = state.timelineReducer;
  return {
    timelines,
    hasMore,
  };
};

export default connect(mapStateToProps)(Home);
