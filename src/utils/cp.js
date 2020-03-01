import cp from 'child_process';
import util from 'util';

cp.exec = util.promisify(cp.exec);

export default cp;
