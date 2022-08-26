'use strict';

import fs from 'fs';
import path from 'path';
import promisify from 'util';

// var Keyv = require('keyv');
// var { Octokit } = require('@octokit/rest');
import { Downloader } from 'github-download-directory';

//var mkdir = promisify(fs.mkdir);
//var writeFile = promisify(fs.writeFile);

async function createDirectories(filepath) {
  var dir = path.dirname(filepath);
  return fs.mkdir(dir, { recursive: true });
}

async function output(file) {
  await createDirectories(file.path);
  fs.writeFileSync(file.path, file.contents);
}

export class QuestDownloader extends Downloader {

  constructor(options = {}) {
    super(options);
  }
/*
  async recurseTree(owner, repo, directory, options = {}) {
    var { data } = await this._octokit.repos.getContent({
      owner,
      repo,
      ref: options.sha,
      path: directory,
    });

    var recurseDirs = data.map((node) => {
      if (node.type === 'dir') {
        return this.recurseTree(owner, repo, node.path, options);
      }
      return {
        path: node.path,
        type: node.type,
        sha: node.sha,
      };
    });

    return Promise.all(recurseDirs).then((nodes) => nodes.flat());
  }

  async getTree(owner, repo, directory, options = {}) {
    var sha = options.sha;
    var cacheKey = sha ? `${owner}/${repo}#${sha}` : `${owner}/${repo}`;

    var cachedTree = await this.cache.get(cacheKey);
    if (cachedTree) {
      return cachedTree;
    }

    var tree = await this.recurseTree(owner, repo, directory, options);

    await this.cache.set(cacheKey, tree);

    if (typeof this.cache.save === 'function') {
      await this.cache.save();
    }

    return tree;
  }

  async fetchFiles(owner, repo, directory, options = {}) {
    var tree = await this.getTree(owner, repo, directory, options);

    var files = tree
      .filter((node) => node.path.startsWith(directory) && node.type === 'file')
      .map(async (node) => {
        var { data } = await this._octokit.git.getBlob({
          owner,
          repo,
          file_sha: node.sha,
        });
        return {
          path: node.path,
          contents: Buffer.from(data.content, data.encoding),
        };
      });

    return Promise.all(files);
  }

  async download(owner, repo, directory, options = {}) {
    var files = await this.fetchFiles(owner, repo, directory, options);
    return Promise.all(files.map(output));
  }
*/
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
