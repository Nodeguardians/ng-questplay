'use strict';

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import process from 'process';
import child_process from 'child_process';

import { Downloader } from 'github-download-directory';

const BAR = "■■■■■■■";
const PAD = "       ";

const sleep = (ms) => {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
};

export class QuestDownloader extends Downloader {

  constructor(options = {}) {
    super(options);
  }

  async downloadDirectory(owner, repo, directoryPath, options = {}) {
    let barLoad = this.startProgressBar();
    await super.download(owner, repo, directoryPath, options);
    await barLoad.then(() => this.stopProgressBar("Download finished"));
  }

  async downloadFile(owner, repo, filePath, options = {}) {

    const rootPath = options.rootPath == undefined
      ? cwd()
      : options.rootPath;

    const file = await this._octokit.repos.getContent({
      owner,
      repo,
      ref: options.sha,
      path: filePath,
    });

    const decodedContent = Buffer.from(file.data.content, file.data.encoding);
    fs.writeFileSync(path.join(rootPath, filePath), decodedContent);
  }

  async installSubpackage() {
    await this.startProgressBar()
      .then(() => child_process.execSync('npm install'))
      .then(() => this.stopProgressBar("Installation finished"));
  }

  // Progress bar is superfluous, purely a UI/UX illusion ;)
  async startProgressBar() {
    for (let i = 0; i < 4; i++) {
      const bar = BAR.repeat(i);
      const pad = PAD.repeat(4 - i);
      process.stdout.write(chalk.grey(`\r[${bar}${pad}]`));
      await sleep(150);
    }
  }

  async stopProgressBar(endMessage) {
    console.log(chalk.grey(`\r[${BAR.repeat(4)}] ${endMessage}`));
    await sleep(200);
  }
}
