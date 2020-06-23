export const DUMMY_CHAT_ID = 'fake id';
export const MSG_INPUT_SELECTOR = '.new-message form textarea';
export const CHAT_WINDOW_SELECTOR = '.chat .messages';
export const REGEX = {
  URL: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i,
  EMAIL: /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i,
  PHONE_NUMBER: /^[0-9]{13, }$/,
};
export const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001'
  : 'https://igramweb.herokuapp.com';
