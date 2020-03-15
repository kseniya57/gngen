import chalk from 'chalk';
import { dirname, fs } from '../utils';
import { chooseAction, isOk } from '../utils/prompt';
import { FileManager } from '../managers';

export default class CreateCommand {
  constructor(appName) {
    this.appName = appName;
  }
  
  async run() {
    /* directory for project */
    if (this.appName.length) {
      try {
        await fs.mkdir(this.appName);
      } catch (e) {
        /* Directory already exist */
        const action = await chooseAction(this.appName);

        switch (action) {
          case 'overwrite':
            await fs.rmdir(this.appName);
            await fs.mkdir(this.appName);
            break;
          case 'merge':
            /* continue, merge will be done by default */
            break;
          default:
            /* cancel project creation */
            return;
        }
      }
    } else if (!(await isOk('Create new project in current directory?'))) {
      return;
    }

    console.log(chalk.cyan('Creating project...🛠'));

    console.log(chalk.cyan('Copping project files...📂'));

    /* common project files */
    await FileManager.copyDir(`${dirname}/templates/base`, this.appName);
  };
  
}
