import { connect } from 'react-redux';
import ChatBox from '@/components/DirectMessage/ChatBox';

const mapStateToProps = (state) => {
  const { user, authenticated } = state.session;
  return {
    user,
    authenticated,
  };
};

export default connect(mapStateToProps)(ChatBox);
