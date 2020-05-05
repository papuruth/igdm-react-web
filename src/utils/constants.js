export const DUMMY_CHAT_ID = 'fake id';
export const MSG_INPUT_SELECTOR = '.new-message form textarea';
export const CHAT_WINDOW_SELECTOR = '.chat .messages';
export const URL_REGEX = new RegExp(
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
  'i',
);
console.log(process.env.NODE_ENV);
export const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001'
  : 'https://igdm-react.herokuapp.com';
