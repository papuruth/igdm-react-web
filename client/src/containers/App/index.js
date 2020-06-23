import { connect } from 'react-redux';
import App from '@/App';

const mapStateToProps = (state) => {
  const { authenticated, user } = state.session;
  return {
    authenticated,
    user,
  };
};

export default connect(mapStateToProps)(App);
