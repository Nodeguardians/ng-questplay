'use strict';

import fs from 'fs';
import path from 'path';

import { Downloader } from 'github-download-directory';

export class QuestDownloader extends Downloader {

  constructor(options = {}) {
    super(options);
  }

  async downloadDirectory(owner, repo, directoryPath, options = {}) {
    super.download(owner, repo, directoryPath, options);
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

}
