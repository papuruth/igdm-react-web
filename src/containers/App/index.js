import { connect } from 'react-redux';
import App from '@/App';

const mapStateToProps = (state) => {
  const { authenticated } = state.session;
  return {
    authenticated,
  };
};

export default connect(mapStateToProps)(App);
