const path = require('path');
const fs = require('fs');
const utils = require('./utils');

function parseDataFile(filePath, defaults) {
  try {
    if (utils.canUseFileStorage()) {
      return JSON.parse(fs.readFileSync(filePath));
    }
    return defaults;
  } catch (error) {
    return defaults;
  }
}

class Store {
  constructor(storeProps) {
    const userDataPath = 'userData';
    this.path = path.join(userDataPath, `${storeProps.configName}.store`);
    this.data = parseDataFile(this.path, storeProps.defaults);
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

module.exports = Store;
