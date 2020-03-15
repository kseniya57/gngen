import { exit } from '../utils';
import commands from '../commands';

export default class ProgramManager {
  constructor() {
    this.parse();
  }

  async parse() {
    const argv = process.argv.slice(2);
    if (argv.length < 1) {
      exit('Command name required');
    }

    [this.command, this.appName] = [...argv];
    /* parse options */
    this.options = {};
    let i = 0;
    while (i < argv.length) {
      if (argv[i].startsWith('--')) {
        if (i < argv.length - 1 && !argv[i + 1].startsWith('--')) {
          this.options[argv[i].slice(2)] = argv[i + 1];
          i++;
        } else {
          this.options[argv[i].slice(2)] = true;
        }
      }
      i++;
    }
    await this.run();
  }

  async run() {
    const Command = commands[this.command];
    if (Command) {
      await new Command(this.appName, this.options).run();
    }
  }
}
