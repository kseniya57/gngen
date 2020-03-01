import chalk from 'chalk';
import { cp, dirname, fs } from '../utils';
import { chooseAction, isOk } from '../utils/prompt';
import { FileManager } from '../managers';

const currentDirectory = process.cwd();

export default async (name) => {
  /* directory for project */
  if (name.length) {
    try {
      await fs.mkdir(name);
    } catch (e) {
      /* Directory already exist */
      const action = await chooseAction(name);

      switch (action) {
        case 'merge':
          await fs.rmdir(name);
          await fs.mkdir(name);
          break;
        case 'overwrite':
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

  // console.log(chalk.cyan('Installing dependencies...🛠'));
  //
  // await Promise.all([
  //   cp.exec(`cd ${currentDirectory}/${name}/backend && npm install`),
  //   cp.exec(`cd ${currentDirectory}/${name}/frontend && npm install`)
  // ]);
  //
  // console.log(chalk.green('Done!🎊🎁😺 Enjoy with your new project!🎈'));
};
