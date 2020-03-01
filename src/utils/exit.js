import chalk from 'chalk';

export default (message = 'Command not found') => {
  console.log(chalk.red(message));
  process.exit(1);
};
