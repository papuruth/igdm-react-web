/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');

const buildAndGetStoragePath = () => {
  const storagePath = path.join('userData', 'session-cookie');
  if (!fs.existsSync(storagePath)) {
    // make directory if it doesn't exist
    fs.mkdirSync(storagePath, { recursive: true });
  }
  return storagePath;
};

const canUseFileStorage = () => {
  try {
    fs.accessSync('userData', fs.W_OK);
    return true;
  } catch (error) {
    return false;
  }
};

const guessUsername = () => {
  let username;
  if (canUseFileStorage()) {
    const files = fs.readdirSync(`${buildAndGetStoragePath()}`);
    if (files.length && files[0].endsWith('.json')) {
      username = files[0].slice(0, -5);
    }
  }
  return username;
};

const getStoredCookie = (filePath) => {
  let storage;
  let username;

  if (canUseFileStorage()) {
    username = guessUsername();
    if (!filePath && username) {
      filePath = `${username}.json`;
    }
    if (filePath) {
      storage = fs.readFileSync(
        `${buildAndGetStoragePath()}/${filePath}`,
        'utf8',
      );
    }
  }
  return storage;
};

const clearCookieFiles = () => {
  // delete all session storage
  if (canUseFileStorage() && fs.existsSync(buildAndGetStoragePath())) {
    fs.readdirSync(`${buildAndGetStoragePath()}`).forEach((filename) => {
      fs.unlinkSync(`${buildAndGetStoragePath()}/${filename}`);
    });
  }
};

const storeCookies = (username, cookies) => {
  if (fs.existsSync(buildAndGetStoragePath()) && canUseFileStorage()) {
    const storagePath = buildAndGetStoragePath();
    const filePath = `${username}.json`;
    fs.writeFileSync(`${storagePath}/${filePath}`, JSON.stringify(cookies));
  }
};

const rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const portSwitcher = () => {
  return new Promise((resolve) => {
    rlInterface.question(
      chalk.yellow('Would you like to use another? (Y/n): '),
      (answer) => {
        if (answer.match(/^[a-zA-Z]+$/) && answer === 'Y') {
          rlInterface.close();
          resolve(true);
        }
        rlInterface.close();
        resolve(false)
      },
    );
  })
};

module.exports = {
  canUseFileStorage,
  guessUsername,
  getStoredCookie,
  clearCookieFiles,
  storeCookies,
  portSwitcher,
};
