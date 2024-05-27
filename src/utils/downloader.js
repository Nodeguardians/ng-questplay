'use strict';

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import child_process from 'child_process';

import JSZip from 'jszip';
import { Octokit } from '@octokit/rest';
import { ProgressBar } from './progressbar.js'
import { UPDATE_ABORTED_MESSAGE } from './messages.js';

export class QuestDownloader {

  constructor(options = {}) {
    this.progressBar = new ProgressBar();
    this._octokit = new Octokit(options.github);
  }

  async downloadQuest(owner, repo, directoryPath, options = {}) {
    const zipFilePath = `${directoryPath}.zip`;

    this.progressBar.start();
    try {

      const file = await this._octokit.repos.getContent({
        owner,
        repo,
        ref: options.sha,
        path: zipFilePath,
      });
  
      const decodedContent = Buffer.from(
        file.data.content, 
        file.data.encoding
      );

      await this.unzip(decodedContent);

    } catch (err) {
      this.progressBar.fail("Download failed");
      throw err;
    }

    await this.progressBar.stop("Download finished");
  }

  async downloadQuestplay(options = {}) {
    this.progressBar.start();
    try {

      const zipped = await this._octokit.repos.downloadZipballArchive({
        owner: "Nodeguardians",
        repo: "ng-questplay",
        ref: options.sha
      });

      await this.unzip(zipped.data, 1);

    } catch (err) {
      this.progressBar.fail("Download failed");
      throw err;
    }
    await this.progressBar.stop("Download finished");
  }

  async unzip(data, depth = 0) {
    const zip = await JSZip.loadAsync(data);

    for (const key of Object.keys(zip.files)) {
      const file = zip.files[key];

      if (file.dir) {
        continue;
      }

      if (depth > 0) {
        file.name = file.name.split('/').slice(depth).join('/');
      }
      
      var dirname = path.dirname(file.name);
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
      }

      fs.writeFileSync(file.name, await file.async("nodebuffer"));
    }
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

    process.on('SIGINT', () => {});

    try {
      await this.progressBar.start()
        .then(() => child_process.execSync('npm install'))
        .then(() => this.progressBar.stop("Installation finished"));
    } catch (err) {
      console.log(UPDATE_ABORTED_MESSAGE);
      console.log(chalk.grey("Exiting..."));
    }
    
  }

}
