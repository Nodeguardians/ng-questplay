import chalk from 'chalk';
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import fs from 'fs';
import { mainPath, navigateToMainDirectory, readSettings } from './utils/navigation.js';
import { QuestDownloader } from './utils/downloader.js';
import { getQuest } from './quest/index.js';

import {
  BAD_TOKEN_MESSAGE,
  NavigateToQuestMessage, 
  QUEST_ALREADY_EXISTS_MESSAGE, 
  QUEST_NOT_FOUND_MESSAGE, 
  UNCOMMITTED_FILES_BEFORE_DOWNLOAD_MESSAGE, 
  UPDATE_QUEST_CONFIRMATION, 
  UPDATE_REMINDER_MESSAGE
} from './utils/messages.js';
import { isLatestVersion } from './utils/versions.js';
import simpleGit from 'simple-git';

const git = simpleGit();

export async function findQuest(questName) {

  navigateToMainDirectory();

  // These quests are in the directory for testing purposes
  if (questName == "test-build-quest" || questName == "test-ctf-quest") {
    console.log(QUEST_NOT_FOUND_MESSAGE);
    process.exit(1);
  }

  const quest = getQuest(questName);
  if (quest == null) {
    // Quest not found
    console.log(QUEST_NOT_FOUND_MESSAGE);
    process.exit(1);
  }
  
  const message = chalk.cyan(
    chalk.bold(`\n${quest.info.name} (${quest.info.version})`),
    'found in',
    chalk.bold(`${quest.campaignName}\n`)
  );

  console.log(message);
  await queryAndPullQuest(quest);

};

async function queryAndPullQuest(quest) {

  const localVersion = quest.localVersion();

  if (localVersion == quest.info.version) {
    console.log(QUEST_ALREADY_EXISTS_MESSAGE);
    console.log(NavigateToQuestMessage(quest.localPath()));
    process.exit(0);
  }

  const message = localVersion == null
    ? "Download?"
    : UPDATE_QUEST_CONFIRMATION;

  const answer = await inquirer.prompt({
    name: 'overwrite',
    type: 'list',
    message: message,
    choices: ['Yes', 'Cancel']
  });

  if (answer.overwrite == 'Cancel') {
    console.log(chalk.gray("\nDownload cancelled"));
    process.exit(0);
  }

  console.log();

  // Developer Mode: Download file and exit.
  const isDev = readSettings().devMode;

  // (1) Ensure all changes saved (Skip if dev mode)
  if (!isDev) {
    const statusSummary = await git.status()
    if (statusSummary.files.length) {
      console.log(UNCOMMITTED_FILES_BEFORE_DOWNLOAD_MESSAGE);
      process.exit(1);
    }
  }

  fs.rmSync(quest.localPath(), { recursive: true, force: true });

  // (2) Download quest
  console.log(chalk.green("Downloading quest..."));

  dotenv.config({ path: './.env' });
  const token = process.env.GITHUB_TOKEN;
  
  let options = {};
  if (token != undefined) {
    options.github = { auth: token };
  }

  const authDownloader = new QuestDownloader(options);

  try {
    await authDownloader.downloadQuest(
        'NodeGuardians', 
        quest.fromRepository, 
        quest.downloadPath()
    );
    } catch (err) {
        if (err.status == 401) {
            console.log(BAD_TOKEN_MESSAGE);
        } else {
            console.log(err);
        }
        process.exit(1);
    }

  // (3) Install Quest
  console.log(chalk.green("\nInstalling quest..."));
  if (quest.language == "solidity") {
    // TODO: Refactor this to be multi-protocol friendly
    await authDownloader.installSubpackage();
  }

  // (4) Commit new changes (Skip if dev mode)
  try {
    if (!isDev) {
      await git.add(mainPath());
      await git.commit(`Download quest ${quest.info.name}`);
      console.log(chalk.green("\nDownload committed.\n"));
    }
  } catch (err) {

    console.log(chalk.grey("\ngit commit failed. Try manually committing the downloaded quest.\n"));
    process.exit(0);

  }

  // (5) Print Quest Location
  console.log(NavigateToQuestMessage(quest.localPath()));

  if (!isDev && !await isLatestVersion()) {
    console.log(UPDATE_REMINDER_MESSAGE);
  }

}
