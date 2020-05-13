import { connect } from 'react-redux';
import Header from '@/components/Header';

const mapStateToProps = (state) => {
  const { authenticated, user } = state.session;
  const { searchUserResult, searchUserLoader } = state.chatReducer;
  return {
    authenticated,
    user,
    searchUserLoader: searchUserLoader || false,
    searchUserResult: searchUserResult || [],
  };
};

export default connect(mapStateToProps)(Header);
