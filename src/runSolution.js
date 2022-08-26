#!/usr/bin/env node
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import { navigateToQuestDirectory, mainPath } from './utils.js';
import { QuestDownloader } from './questDownloader.js';
import { CREDENTIALS_NOT_FOUND_MESSAGE } from './messages.js';

export async function runSolution() {

  try {
    navigateToQuestDirectory();
  } catch (error) {
    console.log(chalk.red(error));
    process.exit();
  }

  const credentialsPath = path.join(mainPath(), './.credentials');
  if (!fs.existsSync(credentialsPath)) {
    console.log(CREDENTIALS_NOT_FOUND_MESSAGE);
    process.exit();
  }

  const token = fs.readFileSync(credentialsPath).toString();
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