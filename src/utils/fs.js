import _ from 'lodash';
import fs from 'fs';
import util from 'util';

fs.lstat = util.promisify(fs.lstat);
fs.mkdir = util.promisify(fs.mkdir);
fs.rmdir = util.promisify(fs.rmdir);
fs.readdir = util.promisify(fs.readdir);
fs.writeFile = util.promisify(fs.writeFile);
fs.appendFile = util.promisify(fs.appendFile);

const readFilePromise = util.promisify(fs.readFile);
fs.readFile = filePath => readFilePromise(filePath).then(_.toString);
fs.copyFile = util.promisify(fs.copyFile);
fs.unlink = util.promisify(fs.unlink);

export default fs;
