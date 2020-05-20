import { connect } from 'react-redux';
import EditProfile from '@/components/EditProfile';

const mapStateToProps = (state) => {
  const { user } = state.session;
  const { currentUser } = state.userReducer;
  return {
    user,
    currentUser,
  };
};

export default connect(mapStateToProps)(EditProfile);
