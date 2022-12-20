'use strict';

import chalk from 'chalk';
import process from 'process';

const BAR = "■■■■■■■";
const PAD = "       ";

const sleep = (ms) => {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
};

// Progress bar is superfluous, purely a UI/UX illusion ;)
export class ProgressBar {

  constructor(interval = 150) {
    this.interval = interval;
  }

  async start() {
    for (let i = 0; i < 4; i++) {
      const bar = BAR.repeat(i);
      const pad = PAD.repeat(4 - i);
      process.stdout.write(chalk.grey(`\r[${bar}${pad}]`));
      await sleep(this.interval);
    }
  }

  async stop(endMessage) {
    console.log(chalk.grey(`\r[${BAR.repeat(4)}] ${endMessage}`));
    await sleep(this.interval + 50);
  }

  async fail(errMessage) {
    console.log(chalk.grey(`\r[${BAR.repeat(3) + PAD}]` + chalk.red(`${errMessage}`)));
    await sleep(this.interval + 50);
  }

}
