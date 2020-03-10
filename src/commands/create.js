import chalk from 'chalk';
import { dirname, fs } from '../utils';
import { chooseAction, isOk } from '../utils/prompt';
import { FileManager } from '../managers';

export default async (name) => {
  /* directory for project */
  if (name.length) {
    try {
      await fs.mkdir(name);
    } catch (e) {
      /* Directory already exist */
      const action = await chooseAction(name);

      switch (action) {
        case 'overwrite':
          await fs.rmdir(name);
          await fs.mkdir(name);
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
  await FileManager.copyDir(`${dirname}/templates/base`, name);
};
