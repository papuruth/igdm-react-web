/* eslint-disable jsx-a11y/control-has-associated-label */
import { ReactComponent as Comment } from '@/assets/images/comment.svg';
import { ReactComponent as SharePost } from '@/assets/images/SharePost.svg';
import { timelineAction } from '@/redux/timeline/timelineAction';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { AccountCircle, BookmarkBorder, MoreHoriz } from '@material-ui/icons';
import FavoriteIcon from '@material-ui/icons/Favorite';
import clsx from 'clsx';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Player } from 'video-react';
import BigPlayButton from 'video-react/lib/components/BigPlayButton';
import ControlBar from 'video-react/lib/components/control-bar/ControlBar';
import Shortcut from 'video-react/lib/components/Shortcut';
import { StyledContainer } from './styles';

const useStyles = (theme) => ({
  root: {
    maxWidth: 616,
    marginBottom: '3rem',
    boxShadow:
      '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 5px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  spanRight: {
    marginLeft: '8px',
  },
  likeIcon: {
    fill: 'red',
  },
  likeAvatar: {
    width: '20px',
    height: '20px',
    display: 'inline-block',
    verticalAlign: 'middle',
  },
});

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.newShortcuts = [
      // Press number 1 to jump to the postion of 10%
      {
        keyCode: 32 || 75, // k or spacebar
        // handle is the function to control the player
        // player: the player's state
        // actions: the player's actions
        handle: (player, actions) => {
          if (player.hasStarted) {
            actions.pause({
              action: 'pause',
              source: 'shortcut',
            });
            window.scrollBy(window.scrollY, 819);
          }
        },
      },
      {
        keyCode: 38, // Up arrow
        handle: () => {}, // override it's default handle
      },
      // Ctrl/Cmd + Right arrow to go forward 30 seconds
      {
        keyCode: 39, // Right arrow
        ctrl: true, // Ctrl/Cmd
        handle: () => {},
      },
    ];
  }

  componentDidMount() {
    // subscribe state change
    try {
      this.player.subscribeToStateChange(this.handleStateChange);
      const videoTag = document.getElementsByTagName('video');
      Array.from(videoTag).forEach((element) =>
        element.setAttribute('onContextMenu', 'return false;'));
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidUpdate() {
    // subscribe state change
    try {
      this.player.subscribeToStateChange(this.handleStateChange);
      const videoTag = document.getElementsByTagName('video');
      Array.from(videoTag).forEach((element) =>
        element.setAttribute('onContextMenu', 'return false;'));
    } catch (error) {
      console.log(error.message);
    }
  }

  renderCarousel = (media) =>
    media.map(({ id, image_versions2, video_versions }) => {
      const mediaUrl = image_versions2.candidates[0];
      if (image_versions2 && video_versions) {
        const videoUrl = video_versions[0].url;
        return (
          <Player
            playsInline
            ref={(player) => {
              this.player = player;
            }}
            key={id.split('_')[0]}
          >
            <source src={videoUrl} />
            <Shortcut dblclickable={false} shortcuts={this.newShortcuts} />
            <ControlBar disableCompletely className="my-class" />
            <BigPlayButton position="center" />
          </Player>
        );
      }
      return (
        <img
          src={mediaUrl.url}
          alt=""
          height="616px"
          width="616px"
          key={id.split('_')[0]}
        />
      );
    });

  fetchMoreData = () => {
    const { dispatch } = this.props;
    dispatch(timelineAction());
  };

  handleExpandClick = () => {
    this.setState((state) => ({
      expanded: !state.expanded,
    }));
  };

  handleStateChange = (state, prevState) => {
    const { ended } = state;
    if (ended !== prevState.ended) {
      console.log(ended);
      this.player.play();
    }
  };

  render() {
    const { data, hasMore, classes } = this.props;
    const { expanded } = this.state;
    const responsive = {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
      },
    };

    return (
      <StyledContainer>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.fetchMoreData}
          hasMore={hasMore || false}
          loader=""
          threshold={2000}
        >
          {data
            && data.map(({ media_or_ad }) => {
              const item = media_or_ad;
              if (item) {
                const { username, profile_pic_url } = item.user;
                const isAd = 'ad_action' in item
                  || 'ad_header' in item
                  || 'ad_header_style' in item;
                const location = item.location ? item.location.name : '';
                const mediaUrl = item.image_versions2
                  ? item.image_versions2.candidates[0]
                  : '';
                const videoUrl = item.video_versions
                  ? item.video_versions[0].url
                  : null;
                const isCarousel = 'carousel_media' in item;
                const isCaption = 'caption' in item && item.caption;
                const {
                  has_liked,
                  top_likers,
                  facepile_top_likers,
                  like_count,
                  code,
                } = item;
                const liker = facepile_top_likers
                  && facepile_top_likers.filter(
                    (likerItem) => likerItem.username === top_likers[0],
                  )[0];
                return (
                  !isAd && (
                    <Card className={classes.root} key={item.id.split('_')[0]}>
                      <CardHeader
                        avatar={(
                          <Avatar
                            aria-label="user_image"
                            alt={username}
                            className={classes.avatar}
                            src={profile_pic_url || <AccountCircle />}
                          />
                        )}
                        action={(
                          <IconButton aria-label="settings">
                            <MoreHoriz />
                          </IconButton>
                        )}
                        title={username}
                        subheader={location}
                      />
                      {!isCarousel && (
                        <div>
                          {videoUrl ? (
                            <Player
                              ref={(player) => {
                                this.player = player;
                              }}
                              playsInline
                            >
                              <source src={videoUrl} />
                              <Shortcut
                                dblclickable={false}
                                shortcuts={this.newShortcuts}
                              />
                              <ControlBar
                                disableCompletely
                                className="my-class"
                              />
                              <BigPlayButton position="center" />
                            </Player>
                          ) : (
                            <img
                              alt="media"
                              src={mediaUrl.url}
                              height={
                                mediaUrl.height > 750
                                  ? '750px'
                                  : mediaUrl.height
                              }
                              width="616px"
                            />
                          )}
                        </div>
                      )}
                      {isCarousel && (
                        <div className="center">
                          <div className="carousel">
                            <Carousel
                              showDots
                              responsive={responsive}
                              containerClass="carousel-container"
                              removeArrowOnDeviceType={['tablet', 'mobile']}
                              dotListClass="custom-dot-list-style"
                              itemClass="carousel-item-padding-40-px"
                            >
                              {this.renderCarousel(item.carousel_media)}
                            </Carousel>
                          </div>
                        </div>
                      )}
                      <CardActions disableSpacing>
                        <IconButton aria-label="like">
                          <FavoriteIcon
                            classes={{
                              root: has_liked && classes.likeIcon,
                            }}
                          />
                        </IconButton>
                        <IconButton aria-label="comment">
                          <Comment />
                        </IconButton>
                        <IconButton aria-label="share">
                          <SharePost />
                        </IconButton>
                        <IconButton
                          className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                          })}
                          onClick={this.handleExpandClick}
                          aria-expanded={expanded}
                          aria-label="show more"
                        >
                          <BookmarkBorder />
                        </IconButton>
                      </CardActions>

                      <CardContent>
                        {top_likers && liker && top_likers.length > 0 && (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="div"
                          >
                            <span>
                              <Avatar
                                className={classes.likeAvatar}
                                alt={liker.username}
                                src={liker.profile_pic_url}
                              />
                            </span>
                            <span className={classes.spanRight}>
                              Lked by
                              <a
                                href={`https://instagram.com/${liker.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  marginLeft: '.25em',
                                  color: '#000',
                                  fontWeight: '500',
                                }}
                              >
                                {liker.username}
                              </a>
                              {' '}
                              and
                              <a
                                href={`https://instagram.com/p/${code}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  marginLeft: '.25em',
                                  color: '#000',
                                  fontWeight: '500',
                                }}
                              >
                                {like_count}
                                {' '}
                                others.
                              </a>
                            </span>
                          </Typography>
                        )}
                        {isCaption && (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            <span>
                              <a
                                style={{ color: '#000', fontWeight: '500' }}
                                href={`https://instagram.com/${username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {username}
                              </a>
                            </span>
                            <span className={classes.spanRight}>
                              {item.caption.text}
                            </span>
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  )
                );
              }
              return null;
            })}
        </InfiniteScroll>
      </StyledContainer>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(Timeline);
