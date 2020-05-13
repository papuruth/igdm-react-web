/* eslint-disable react/prop-types */
/** @jsx jsx */
import { formatNumber } from '@/utils/numberFormat';
import { ArrowDropDown, MoreHoriz, Settings } from '@material-ui/icons';
import { ReactComponent as FollowedFriends } from '@/assets/images/followed.svg';
import { jsx } from '@emotion/core';
import {
  accountDetaildFollowDownBtnWrapper,
  accountDetailsConfigWrapper,
  accountDetailsEditProfile,
  accountDetailsEditProfileBtn,
  accountDetailsFollowBtnContent,
  accountDetailsFollowBtnWrapper,
  accountDetailsFollowDownBtnContent,
  accountDetailsFollowedByContent,
  accountDetailsFollowedByWrapper,
  accountDetailsFollowedUser,
  accountDetailsFollowingListWrapper,
  accountDetailsFollowWrapper,
  accountDetailsInfoName,
  accountDetailsInfoWrapper,
  accountDetailsListContent,
  accountDetailsListContentChild,
  accountDetailsListContentChildSpan,
  accountDetailsSettingIconContent,
  accountDetailsSettingIconWrapper,
  accountDetailsUsername,
  accountDetailsVerified,
  accountDetailsWrapper,
  accountProfileContent,
  accountProfileContent1,
  accountProfileContentBtn,
  accountProfileHeader,
  accountProfileImage,
  accountProfilePicWrapper,
  profilePicInput,
} from './styles';

export const RenderProfileHeader = ({
  userInfo,
  user,
  friendship,
  location,
}) => {
  const {
    pk,
    username,
    profile_pic_url,
    follower_count,
    following_count,
    media_count,
    full_name,
    is_private,
    is_verified,
    biography,
    profile_context_mutual_follow_ids,
    profile_context_links_with_user_ids,
    mutual_followers_count,
  } = location.state ? userInfo : userInfo || user;
  let moreFollower;

  const mutualFollower = [];
  let followerArray;
  if (
    pk !== user.pk
    && profile_context_links_with_user_ids.length
    && profile_context_mutual_follow_ids.length
    && mutual_followers_count
  ) {
    moreFollower = mutual_followers_count - profile_context_mutual_follow_ids.length;
    followerArray = profile_context_links_with_user_ids.length
      !== profile_context_mutual_follow_ids.length
      ? profile_context_links_with_user_ids.slice(
        0,
        profile_context_mutual_follow_ids.length,
      )
      : profile_context_links_with_user_ids;
    followerArray.forEach((item) => {
      mutualFollower.push(item.username);
    });
  }
  const { followed_by, following } = pk !== user.pk ? friendship : '';
  const privateUser = is_private && pk !== user.pk;
  return (
    <header css={accountProfileHeader}>
      <div css={accountProfilePicWrapper}>
        <div css={accountProfileContent}>
          <div css={accountProfileContent1}>
            <button
              css={accountProfileContentBtn}
              title="Change Profile Photo"
              type="button"
            >
              <img
                alt="Change Profile Pic"
                css={accountProfileImage}
                src={profile_pic_url}
              />
            </button>
            <div>
              <form
                encType="multipart/form-data"
                method="POST"
                role="presentation"
              >
                <input
                  accept="image/jpeg,image/png"
                  css={profilePicInput}
                  type="file"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <section css={accountDetailsWrapper}>
        <div css={accountDetailsConfigWrapper}>
          <h2 css={accountDetailsUsername}>{username}</h2>
          {is_verified && (
            <span css={accountDetailsVerified} title="Verified" />
          )}
          {!followed_by && !following && pk === user.pk && (
            <a css={accountDetailsEditProfile} href="/accounts/edit/">
              <button css={accountDetailsEditProfileBtn} type="button">
                Edit Profile
              </button>
            </a>
          )}
          {following && (
            <a css={accountDetailsEditProfile} href={`/direct/${username}`}>
              <button css={accountDetailsEditProfileBtn} type="button">
                Message
              </button>
            </a>
          )}
          {following && (
            <span css={accountDetailsEditProfile}>
              <button css={accountDetailsEditProfileBtn} type="button">
                <FollowedFriends />
              </button>
            </span>
          )}
          {following && (
            <span css={accountDetailsEditProfile}>
              <button css={accountDetailsEditProfileBtn} type="button">
                <ArrowDropDown />
              </button>
            </span>
          )}
          {!following && !followed_by && pk !== user.pk && (
            <span css={accountDetailsFollowWrapper}>
              <span css={accountDetailsFollowBtnWrapper}>
                <button css={accountDetailsFollowBtnContent} type="button">
                  Follow
                </button>
              </span>
              {!privateUser && (
                <span css={accountDetaildFollowDownBtnWrapper}>
                  <button
                    css={accountDetailsFollowDownBtnContent}
                    type="button"
                  >
                    <ArrowDropDown />
                  </button>
                </span>
              )}
            </span>
          )}
          <div css={accountDetailsSettingIconWrapper}>
            <button css={accountDetailsSettingIconContent} type="button">
              {!followed_by && !following && pk === user.pk && <Settings />}
              {pk !== user.pk && <MoreHoriz />}
            </button>
          </div>
        </div>
        <ul css={accountDetailsFollowingListWrapper}>
          <li css={accountDetailsListContent}>
            <span css={accountDetailsListContentChild}>
              <span css={accountDetailsListContentChildSpan}>
                {formatNumber(media_count)}
              </span>
              {' '}
              posts
            </span>
          </li>
          <li css={accountDetailsListContent}>
            <a
              css={accountDetailsListContentChild}
              href={`/${username}/followers/`}
            >
              <span css={accountDetailsListContentChildSpan} title="137">
                {formatNumber(follower_count)}
              </span>
              {' '}
              followers
            </a>
          </li>
          <li css={accountDetailsListContent}>
            <a
              css={accountDetailsListContentChild}
              href={`/${username}/following/`}
            >
              <span css={accountDetailsListContentChildSpan}>
                {formatNumber(following_count)}
              </span>
              {' '}
              following
            </a>
          </li>
        </ul>
        <div css={accountDetailsInfoWrapper}>
          <h1 css={accountDetailsInfoName}>{full_name}</h1>
          <br />
          <span>
            {biography
              && biography.split('\n').map((ele) => <p key={ele}>{ele}</p>)}
          </span>
          {mutualFollower.length > 0 && (
            <a
              css={accountDetailsFollowedByWrapper}
              href={`${username}/followers/mutualOnly`}
            >
              <span css={accountDetailsFollowedByContent}>
                Followed by
                {' '}
                <span css={accountDetailsFollowedUser}>
                  {mutualFollower.join(', ')}
                </span>
                {' +'}
                {' '}
                {moreFollower}
                {' '}
                others.
              </span>
            </a>
          )}
        </div>
      </section>
    </header>
  );
};
