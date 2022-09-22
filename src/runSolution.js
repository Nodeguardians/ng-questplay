#!/usr/bin/env node
import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import { navigateToQuestDirectory, mainPath } from './utils/navigation.js';
import { QuestDownloader } from './utils/downloader.js';
import { CREDENTIALS_NOT_FOUND_MESSAGE } from './utils/messages.js';

export async function runSolution() {

  try {
    navigateToQuestDirectory();
  } catch (error) {
    console.log(chalk.red(error));
    process.exit();
  }

  dotenv.config({ path: '../../../.env' });
  const token = process.env.GITHUB_TOKEN;
  if (token == undefined) {
    console.log(CREDENTIALS_NOT_FOUND_MESSAGE);
    process.exit();
  }

  const authDownloader = new QuestDownloader({
    github: { auth: token }
  });

  const relativeQuestPath = path.relative(mainPath(), cwd());

  const filesToTest = JSON.parse(fs.readFileSync('./files-to-test.json'));
  for (const file of filesToTest) {
    const filePath = path.join(relativeQuestPath, file);
    await authDownloader.downloadFile('Nodeguardians', 'ng-quests', filePath, { rootPath: mainPath() });
  }

  const hre = await import('hardhat');
  hre.default.run("test");
  
};