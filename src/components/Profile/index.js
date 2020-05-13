/* eslint-disable react/prop-types */
import {
  fullUserInfoAction,
  userFeedAction,
  searchExactUserAction,
} from '@/redux/user/userAction';
import { Box } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import { RenderPrivateAccount } from './renderPrivateAccount';
import { RenderProfileHeader } from './renderProfileHeader';
import RenderUserFeeds from './renderUserFeeds';
import { MainContainer, MainContainerWrapper, StyledContainer } from './styles';

const useStyles = {
  root: {
    flexGrow: 1,
  },
  header: {
    padding: '30px 0px 30px 0px',
    marginBottom: '44px',
    backgroundColor: '#fafafa',
  },
};

const TabPanel = (props) => {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          style={{
            marginTop: '20px',
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
};

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
    const {
      dispatch, user, userFeeds, location, match,
    } = props;
    const { pk, is_private } = location.state || user;
    const { username } = match.params;
    console.log(this.props);
    if (is_private && location.state) {
      dispatch(fullUserInfoAction(pk));
      dispatch(userFeedAction(pk, userFeeds));
    } else if (!location.state && username !== user.username) {
      dispatch(searchExactUserAction(username));
    } else {
      dispatch(fullUserInfoAction(pk));
      dispatch(userFeedAction(pk, userFeeds));
    }
  }

  componentDidUpdate(prevProps) {
    console.log(this.props, prevProps);
    const {
      dispatch, user, location, match, searchExactUserInfo,
    } = this.props;
    const { pk, is_private } = location.state || user;
    const { username } = match.params;
    if (location.pathname !== prevProps.location.pathname) {
      if (is_private && location.state) {
        dispatch(fullUserInfoAction(pk));
        dispatch(userFeedAction(pk, {}));
      } else {
        dispatch(fullUserInfoAction(pk));
        dispatch(userFeedAction(pk, {}));
      }
    }
    if (
      !location.state
      && Object.keys(prevProps.searchExactUserInfo).length === 0
      && username !== user.username
    ) {
      const userPk = searchExactUserInfo.pk;
      console.log('infinite');
      dispatch(fullUserInfoAction(userPk));
      dispatch(userFeedAction(userPk, {}));
    }
  }

  handleChange = (event, newValue) => {
    this.setState({
      tab: newValue,
    });
  };

  render() {
    const {
      userInfo,
      classes,
      location,
      user,
      friendship,
      allFeeds,
      suggestedUser,
      highlights,
      userFeeds,
      hasMore,
      dispatch,
    } = this.props;
    const { tab } = this.state;
    const { pk, is_private } = location.state ? userInfo : userInfo || user;
    const privateUser = is_private && pk !== user.pk;
    const suggestedUserData = Object.keys(suggestedUser).length > 0 && suggestedUser.users
      ? suggestedUser.users
      : '';
    const userHighlightsData = Object.keys(highlights).length > 0 && highlights.tray
      ? highlights.tray
      : '';
    const { following } = pk !== user.pk ? friendship : '';

    return (
      <StyledContainer>
        <MainContainer>
          <MainContainerWrapper>
            {Object.keys(userInfo).length > 0 && user && (
              <Paper className={classes.header}>
                <RenderProfileHeader
                  userInfo={userInfo}
                  location={location}
                  user={user}
                  friendship={friendship}
                />
              </Paper>
            )}
            <RenderPrivateAccount
              suggestedUserData={suggestedUserData}
              privateUser={privateUser}
              userHighlightsData={userHighlightsData}
              following={following}
            />
            {allFeeds.length > 0 && (
              <>
                <Paper className={classes.root}>
                  <Tabs
                    value={tab}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                  >
                    <Tab label="Item One" />
                    <Tab label="Item Two" />
                    <Tab label="Item Three" />
                  </Tabs>
                </Paper>
                <TabPanel value={tab} index={0}>
                  <RenderUserFeeds
                    allFeeds={allFeeds}
                    pk={pk}
                    userFeeds={userFeeds}
                    hasMore={hasMore}
                    dispatch={dispatch}
                  />
                </TabPanel>
              </>
            )}
          </MainContainerWrapper>
        </MainContainer>
      </StyledContainer>
    );
  }
}

export default withStyles(useStyles)(Profile);
