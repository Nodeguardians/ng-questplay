'use strict';

import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

import { Downloader } from 'github-download-directory';
import { ProgressBar } from './progressbar.js'

const BAR = "■■■■■■■";
const PAD = "       ";

const sleep = (ms) => {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
};

export class QuestDownloader extends Downloader {

  constructor(options = {}) {
    super(options);
    this.progressBar = new ProgressBar();
  }

  async downloadDirectory(owner, repo, directoryPath, options = {}) {
    this.progressBar.start();
    try {
      await super.download(owner, repo, directoryPath, options);
    } catch (err) {
      this.progressBar.fail("Download failed");
      throw err;
    }
    await this.progressBar.stop("Download finished");
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
    await this.progressBar.start()
      .then(() => child_process.execSync('npm install'))
      .then(() => this.progressBar.stop("Installation finished"));
  }

}
