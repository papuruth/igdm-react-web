/** @jsx jsx */
import { jsx } from '@emotion/core';
import { withStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import _ from 'lodash';
import validator from 'validator';
import { saveProfileAction } from '@/redux/user/userAction';
import { Input } from './renderInput';
import { Label } from './renderLabel';
import {
  AccountDisableButton,
  EditProfileForm,
  FormInputContainer,
  FormLabelContainer,
  GenderButton,
  GenderInput,
  PersonalInfoHead,
  PersonalInfoHeadText,
  PersonalInfoHelpText,
  PersonalInfoMessage,
  ProfileInfoContent,
  ProfilePhotoButton,
  ProfilePhotoContainerDiv,
  ProfilePhotoContent,
  ProfilePhotoImg,
  ProfilePhotoInput,
  ProfilePhotoUploadContainer,
  ProfilePhotoUploadForm,
  ProfilePhotoWrapperDiv,
  ProfileUpdateButton,
  ProfileUsername,
  StyledFormGroup,
  SubmitFormButton,
  SubmitFormButtonContainer,
  submitFormsExtraCss,
} from './styles';

const useStyles = (theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
});

class RenderEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      full_name: '',
      biography: '',
      external_url: '',
      phone_number: '',
      email: '',
      gender: '',
      profile_pic_url: '',
      GENDER_TYPE: {
        1: 'Male',
        2: 'Female',
        3: 'Custom',
        4: 'Prefer Not To Say',
      },
      formErrors: { URL: '', PHNO: '', EMAIL: '' },
      urlValid: true,
      phoneNumberValid: true,
      emailValid: true,
      formValid: true,
      formEdited: false,
    };
  }

  componentDidMount() {
    const { currentUser } = this.props;
    const { GENDER_TYPE } = this.state;
    const {
      username,
      full_name,
      biography,
      external_url,
      phone_number,
      email,
      gender,
      profile_pic_url,
    } = currentUser;
    this.setState({
      username,
      full_name,
      biography,
      external_url,
      phone_number,
      email,
      gender: GENDER_TYPE[gender],
      profile_pic_url,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentUser } = this.props;
    const { GENDER_TYPE } = prevState;
    if (!_.isEqual(currentUser, prevProps.currentUser)) {
      this.updateState(currentUser, GENDER_TYPE);
    }
  }

  updateState = (currentUser, GENDER_TYPE) => {
    const {
      username,
      full_name,
      biography,
      external_url,
      phone_number,
      email,
      gender,
      profile_pic_url,
    } = currentUser;
    this.setState({
      username,
      full_name,
      biography,
      external_url,
      phone_number,
      email,
      gender: GENDER_TYPE[gender],
      profile_pic_url,
    });
  };

  submitEditProfileForm = (event) => {
    event.preventDefault();
    const { dispatch } = this.props;
    const { formValid } = this.state;
    if (formValid) {
      const {
        username,
        full_name,
        biography,
        external_url,
        phone_number,
        email,
      } = this.state;
      const data = new FormData();
      data.append('username', username);
      data.append('first_name', full_name);
      data.append('biography', biography);
      data.append('external_url', external_url);
      data.append('phone_number', phone_number);
      data.append('email', email);
      data.append('gender', 1);
      dispatch(saveProfileAction(data));
    }
  };

  handleUserInput = (event) => {
    const { name, value } = event.target;
    this.setState(
      {
        [name]: value,
        formEdited: true,
      },
      () => this.validateFormFields(name, value),
    );
  };

  validateFormFields = (name, value) => {
    const { formErrors, emailValid, urlValid, phoneNumberValid } = this.state;
    const fieldValidationErrors = formErrors;
    let emailCheck = emailValid;
    let urlCheck = urlValid;
    let phoneNumberCheck = phoneNumberValid;
    switch (name) {
      case 'email':
        emailCheck = validator.isEmail(value);
        fieldValidationErrors.EMAIL = emailCheck
          ? ''
          : 'Email id is not formatted properly';
        break;
      case 'phone_number':
        phoneNumberCheck = validator.isMobilePhone(value, 'any', {
          strictMode: true,
        });
        fieldValidationErrors.PHNO = phoneNumberCheck
          ? ''
          : 'Looks like your phone number may be incorrect. Please try entering your full number, including the country code.';
        break;
      case 'external_url':
        urlCheck = validator.isURL(value);
        fieldValidationErrors.URL = urlCheck
          ? ''
          : 'Url is not formatted properly';
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailCheck,
        phoneNumberValid: phoneNumberCheck,
        urlValid: urlCheck,
      },
      this.validateForm,
    );
  };

  validateForm = () => {
    this.setState((state) => {
      return {
        formValid: state.emailValid && state.phoneNumberValid && state.urlValid,
      };
    });
  };

  render() {
    const { classes } = this.props;
    const {
      username,
      full_name,
      biography,
      external_url,
      phone_number,
      email,
      gender,
      profile_pic_url,
      formValid,
      formEdited,
      emailValid,
      phoneNumberValid,
      urlValid,
      formErrors,
    } = this.state;

    return (
      <React.Fragment>
        <ProfilePhotoContainerDiv>
          <ProfilePhotoWrapperDiv>
            <ProfilePhotoContent>
              <ProfilePhotoButton title="Change Profile Photo">
                <ProfilePhotoImg
                  alt="Change Profile Photo"
                  src={profile_pic_url}
                />
              </ProfilePhotoButton>
              <ProfilePhotoUploadContainer>
                <ProfilePhotoUploadForm
                  enctype="multipart/form-data"
                  method="POST"
                  role="presentation"
                >
                  <ProfilePhotoInput
                    accept="image/jpeg,image/png"
                    type="file"
                  />
                </ProfilePhotoUploadForm>
              </ProfilePhotoUploadContainer>
            </ProfilePhotoContent>
          </ProfilePhotoWrapperDiv>
          <ProfileInfoContent>
            <ProfileUsername title={username}>{username}</ProfileUsername>
            <ProfileUpdateButton type="button">
              Change Profile Photo
            </ProfileUpdateButton>
          </ProfileInfoContent>
        </ProfilePhotoContainerDiv>
        <EditProfileForm onSubmit={this.submitEditProfileForm} method="POST">
          <StyledFormGroup>
            <FormLabelContainer>
              <Label _for="full_name" label="Name" />
            </FormLabelContainer>
            <FormInputContainer>
              <Input
                input_aria-required={false}
                input_id="full_name"
                input_type="text"
                input_value={full_name}
                input_name="full_name"
                on_change={this.handleUserInput}
              />
            </FormInputContainer>
          </StyledFormGroup>
          <StyledFormGroup>
            <FormLabelContainer>
              <Label _for="username" label="Username" />
            </FormLabelContainer>
            <FormInputContainer>
              <Input
                input_aria-required={false}
                input_id="username"
                input_type="text"
                input_value={username}
                input_name="username"
                on_change={this.handleUserInput}
              />
            </FormInputContainer>
          </StyledFormGroup>
          <StyledFormGroup>
            <FormLabelContainer>
              <Label _for="biography" label="Bio" />
            </FormLabelContainer>
            <FormInputContainer>
              <Input
                input_aria-required={false}
                input_id="biography"
                input_type="text"
                input_value={biography}
                input_name="biography"
                on_change={this.handleUserInput}
              />
            </FormInputContainer>
          </StyledFormGroup>
          <StyledFormGroup>
            <FormLabelContainer>
              <Label _for="external_url" label="Website" />
            </FormLabelContainer>
            <FormInputContainer>
              <Input
                input_aria-required={false}
                input_id="external_url"
                input_type="text"
                input_value={external_url}
                input_name="external_url"
                on_change={this.handleUserInput}
              />
              {!urlValid && (
                <Alert className={classes.root} severity="error">
                  {formErrors.URL}
                </Alert>
              )}
            </FormInputContainer>
          </StyledFormGroup>
          <StyledFormGroup>
            <FormLabelContainer>
              <Label />
            </FormLabelContainer>
            <FormInputContainer>
              <PersonalInfoHelpText>
                <PersonalInfoHead>
                  <PersonalInfoHeadText>
                    Personal Information
                  </PersonalInfoHeadText>
                </PersonalInfoHead>
                <PersonalInfoMessage>
                  Provide your personal information, even if the account is used
                  for a business, a pet or something else. This won&apos;t be a
                  part of your public profile.
                </PersonalInfoMessage>
              </PersonalInfoHelpText>
            </FormInputContainer>
          </StyledFormGroup>
          <StyledFormGroup>
            <FormLabelContainer>
              <Label _for="email" label="Email" />
            </FormLabelContainer>
            <FormInputContainer>
              <Input
                input_aria-required={false}
                input_id="email"
                input_type="text"
                input_value={email}
                input_name="email"
                on_change={this.handleUserInput}
              />
              {!emailValid && (
                <Alert className={classes.root} severity="error">
                  {formErrors.EMAIL}
                </Alert>
              )}
            </FormInputContainer>
          </StyledFormGroup>
          <StyledFormGroup>
            <FormLabelContainer>
              <Label _for="phone_number" label="Phone Number" />
            </FormLabelContainer>
            <FormInputContainer>
              <Input
                input_aria-required={false}
                input_id="phone_number"
                input_type="text"
                input_value={phone_number}
                input_name="phone_number"
                on_change={this.handleUserInput}
              />
              {!phoneNumberValid && (
                <Alert className={classes.root} severity="error">
                  {formErrors.PHNO}
                </Alert>
              )}
            </FormInputContainer>
          </StyledFormGroup>
          <StyledFormGroup>
            <FormLabelContainer>
              <Label _for="gender" label="Gender" />
            </FormLabelContainer>
            <FormInputContainer style={{ maxWidth: '355px' }}>
              <GenderButton type="button">
                <GenderInput
                  readOnly
                  aria-required={false}
                  id="gender"
                  type="text"
                  value={gender}
                  name="gender"
                  onChange={this.handleUserInput}
                />
              </GenderButton>
            </FormInputContainer>
          </StyledFormGroup>
          <StyledFormGroup>
            <FormLabelContainer css={submitFormsExtraCss}>
              <Label />
            </FormLabelContainer>
            <FormInputContainer>
              <SubmitFormButtonContainer>
                <SubmitFormButton
                  type="submit"
                  disabled={!formEdited && formValid}
                >
                  Submit
                </SubmitFormButton>
                <AccountDisableButton type="button">
                  Temporarily disable my account
                </AccountDisableButton>
              </SubmitFormButtonContainer>
            </FormInputContainer>
          </StyledFormGroup>
        </EditProfileForm>
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(RenderEditForm);
