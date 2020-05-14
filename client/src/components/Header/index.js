/* eslint-disable react/prop-types */
import { ReactComponent as SharePost } from '@/assets/images/SharePost.svg';
import { searchUser, showLoaderAction } from '@/redux/chats/chatsAction';
import { Avatar } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {
  AccountCircle,
  Cancel,
  ExploreOutlined,
  FavoriteBorder,
  Home,
  Search,
} from '@material-ui/icons';
import MoreIcon from '@material-ui/icons/MoreVert';
import React from 'react';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { loaderCss } from './styles';

const useStyles = (theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    border: 'solid 1px #dbdbdb',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(var(--b3f,250,250,250),1)',
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchLoader: {
    position: 'absolute',
    right: '-5px',
    top: '-6px',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  appBarRoot: {
    color: '#000',
    backgroundColor: '#fff',
  },
  profileAvatar: {
    width: '25px',
    height: '25px',
  },
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileMoreAnchorEl: null,
      searchText: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { searchUserResult, dispatch, searchUserLoader } = this.props;
    if (searchUserResult !== prevProps.searchUserResult && searchUserLoader) {
      dispatch(showLoaderAction(false, 'searchUserLoader'));
    }
  }

  handleUserInput = (event) => {
    event.preventDefault();
    const { name, value } = event.currentTarget;
    this.setState(
      {
        [name]: value,
      },
      () => this.handleUserSearch(value),
    );
  };

  handleUserSearch = (value) => {
    const { dispatch } = this.props;
    if (value.trim() === '' || value.trim().length > 0) {
      dispatch(showLoaderAction(true, 'searchUserLoader'));
      dispatch(searchUser(value.trim()));
      // Toast.info('Searching for user started, please wait!');
    }
  };

  handleMobileMenuClose = () => {
    this.setState({
      mobileMoreAnchorEl: null,
    });
  };

  clearSearch = () => {
    this.setState(
      {
        searchText: '',
      },
      () => this.handleUserSearch(''),
    );
  };

  handleMobileMenuOpen = (event) => {
    this.setState({
      mobileMoreAnchorEl: event.currentTarget,
    });
  };

  resetTimeline = () => {
    window.scrollTo(0, 0);
  };

  render() {
    const {
      classes, searchUserResult, searchUserLoader, user,
    } = this.props;
    const { profile_pic_url, username } = user;
    const { mobileMoreAnchorEl, searchText } = this.state;
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const menuId = 'primary-search-account-menu';
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton
            aria-label="go to home"
            color="inherit"
            onClick={this.resetTimeline}
          >
            <Link to="/">
              <Home />
            </Link>
          </IconButton>
          <p>Home</p>
        </MenuItem>
        <MenuItem>
          <IconButton aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="secondary">
              <SharePost />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton aria-label="explore" color="inherit">
            <ExploreOutlined />
          </IconButton>
          <p>Explore</p>
        </MenuItem>
        <MenuItem>
          <IconButton aria-label="activity" color="inherit">
            <FavoriteBorder />
          </IconButton>
          <p>Activity</p>
        </MenuItem>
        <MenuItem>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );
    return (
      <div className={classes.grow}>
        <AppBar position="fixed" classes={{ colorPrimary: classes.appBarRoot }}>
          <Toolbar>
            <Typography className={classes.title} variant="h6" noWrap>
              <Link to="/">IGDM-React</Link>
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <Search />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                autoComplete="off"
                value={searchText}
                name="searchText"
                onChange={this.handleUserInput}
                inputProps={{ 'aria-label': 'search' }}
              />
              <div className={classes.searchLoader}>
                <ClipLoader
                  css={loaderCss}
                  size={30}
                  color="#123abc"
                  loading={searchUserLoader}
                />
                {!searchUserLoader && searchText && (
                  <IconButton onClick={this.clearSearch}>
                    <Cancel />
                  </IconButton>
                )}
              </div>
              {searchUserResult.length > 0 && (
                <div>
                  <div className="search-result-arrow" />
                  <div className="search-result-wrapper">
                    <div className="search-result-content">
                      {searchUserResult.map((item) => {
                        const {
                          username,
                          profile_pic_url,
                          full_name,
                          is_verified,
                          pk,
                        } = item;
                        return (
                          <Link
                            className="search-result-content-child-anchor"
                            key={pk}
                            to={{
                              pathname: username,
                              state: item,
                            }}
                          >
                            <div className="search-result-anchor-content">
                              <div
                                className="search-result-avatar-wrapper"
                                onContextMenu={(e) => e.preventDefault()}
                              >
                                <canvas className="search-result-avatar-canvas" />
                                <span className="search-result-avatar-content">
                                  <img
                                    className="search-result-avatar-image"
                                    src={profile_pic_url}
                                    alt={`${username}'s profile`}
                                  />
                                </span>
                              </div>
                              <div className="search-result-text-wrapper">
                                <div className="search-result-text-content">
                                  <span className="search-result-text-username">
                                    {username}
                                  </span>
                                  {is_verified && (
                                    <div className="search-result-verified-badge" />
                                  )}
                                </div>
                                <span className="search-result-text-name">
                                  {full_name}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Link to="/">
                <IconButton aria-label="show 4 new mails" color="inherit">
                  <Home />
                </IconButton>
              </Link>
              <Link to="/direct/inbox">
                <IconButton aria-label="show 4 new mails" color="inherit">
                  <Badge badgeContent={4} color="secondary">
                    <SharePost />
                  </Badge>
                </IconButton>
              </Link>
              <Link to="/explore">
                <IconButton aria-label="show 4 new mails" color="inherit">
                  <ExploreOutlined />
                </IconButton>
              </Link>
              <Link to="/accounts/activity">
                <IconButton aria-label="show 4 new mails" color="inherit">
                  <FavoriteBorder />
                </IconButton>
              </Link>
              <Link
                key={user.pk}
                to={{
                  pathname: username,
                  state: user,
                }}
              >
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  color="inherit"
                >
                  <Avatar
                    className={classes.profileAvatar}
                    alt=""
                    src={profile_pic_url}
                  />
                </IconButton>
              </Link>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(Header);
