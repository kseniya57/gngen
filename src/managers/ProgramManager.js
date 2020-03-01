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

    [this.command, this.name] = [...argv];
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
    if (Object.keys(commands).includes(this.command)) {
      await commands[this.command](this.name, this.options);
    }
  }
}
