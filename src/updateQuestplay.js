#!/usr/bin/env node
import chalk from 'chalk';
import dotenv from 'dotenv';
import { navigateToMainDirectory } from './utils/navigation.js';
import { QuestDownloader } from './utils/downloader.js';

import { 
  CREDENTIALS_NOT_FOUND_MESSAGE, 
} from './utils/messages.js';

export async function updateQuestplay() {

  navigateToMainDirectory();

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

  console.log();

}
