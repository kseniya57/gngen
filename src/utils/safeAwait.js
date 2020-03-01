import chalk from 'chalk';

export default async (f) => {
  try {
    await f;
    return true;
  } catch (e) {
    console.error(chalk.red(e.message));
    return false;
  }
};
