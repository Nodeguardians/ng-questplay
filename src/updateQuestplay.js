#!/usr/bin/env node
import chalk from 'chalk';
import dotenv from 'dotenv';
import { navigateToMainDirectory } from './utils/navigation.js';
import { QuestDownloader } from './utils/downloader.js';
import { simpleGit } from 'simple-git';

import { 
  CREDENTIALS_NOT_FOUND_MESSAGE, 
  UNCOMMITTED_FILES_BEFORE_UPDATE_MESSAGE
} from './utils/messages.js';
import { isLatestVersion, remoteVersion } from './utils/versions.js';

const git = simpleGit();

export async function updateQuestplay() {

  navigateToMainDirectory();
  console.log();

  // (1) Ensure all changes saved
  const statusSummary = await git.status()
  if (statusSummary.files.length) {
    console.log(UNCOMMITTED_FILES_BEFORE_UPDATE_MESSAGE);
    process.exit(1);
  }

  // (2) Look for update
  if (isLatestVersion()) {
    console.log(chalk.yellow("Questplay is up-to-date.\n"));
    process.exit(0);
  }

  // (3) Pull update
  await pullUpdate();

  console.log();

}

async function pullUpdate() {

  console.log(chalk.green("\nUpdating Questplay..."));

  dotenv.config({ path: './.env' });
  const token = process.env.GITHUB_TOKEN;
  if (token == undefined) {
    console.log(CREDENTIALS_NOT_FOUND_MESSAGE);
    process.exit();
  }

  const authDownloader = new QuestDownloader({
    github: { auth: token }
  });

  await authDownloader.downloadDirectory('NodeGuardians', 'ng-questplay', "");

  console.log(chalk.green("\nInstalling Questplay..."));
  await authDownloader.installSubpackage();

  await git.commit(`Update Questplay to ${remoteVersion()}`);
  console.log(chalk.green("Update committed\n"));

}
