import inquirer from 'inquirer';
import chalk from 'chalk';

export const isOk = async (message) => {
  const { ok } = await inquirer.prompt([
    {
      name: 'ok',
      type: 'confirm',
      message: chalk.magenta(message),
    },
  ]);

  return ok;
};

export const chooseAction = async (name, obj = 'Directory') => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: chalk.magenta(`${obj} ${chalk.cyan(name)} already exist.`),
      choices: [
        { name: 'Overwrite', value: 'overwrite' },
        { name: 'Merge', value: 'merge' },
        { name: 'Cancel', value: false },
      ],
    },
  ]);
  return action;
};
