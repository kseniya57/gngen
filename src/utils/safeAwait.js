import chalk from 'chalk';

export default async (f, showError = true) => {
  try {
    await f;
    return true;
  } catch (e) {
    if (showError) {
      console.error(chalk.red(e.message));
    }
    return false;
  }
};
