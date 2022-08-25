#!/usr/bin/env node
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { CREDENTIALS_NOT_FOUND_MESSAGE, QUEST_ALREADY_EXISTS_MESSAGE, QUEST_NOT_FOUND_MESSAGE, UPDATE_QUEST_CONFIRMATION } from './messages.js';
import { mainPath, navigateToMainDirectory } from './utils.js';
import Downloader from 'github-download-directory';

export async function findQuest(questName) {

  navigateToMainDirectory();
  const directoryPath = path.join(mainPath(), './campaigns/directory.json');
  const directory = JSON.parse(fs.readFileSync(directoryPath));

  for (const campaign of directory) {
    for (const quest of campaign.quests) {
      if (quest.name != questName) continue;

      const message = chalk.green(
        chalk.bold(`\n${questName} (${quest.version})`),
        'found in',
        chalk.bold(`${campaign.name}\n`)
      );

      console.log(message);

      await queryAndPullQuest(`campaigns/${campaign.name}/${quest.name}`, quest.version);
      return;
    }
  }

  // Quest not found
  console.log(QUEST_NOT_FOUND_MESSAGE);
  process.exit();

};

async function queryAndPullQuest(questPath, versionString) {

  const localPath = path.join(mainPath(), questPath);

  let message;
  if (fs.existsSync(localPath)) {

    const packageFile = fs.readFileSync(path.join(localPath, './package.json'));
    const currentVersionString = JSON.parse(packageFile).version;

    if (currentVersionString == versionString) {
      console.log(QUEST_ALREADY_EXISTS_MESSAGE);
      process.exit();
    }

    message = UPDATE_QUEST_CONFIRMATION;

  } else {
    message = "Download?";
  }

  const answer = await inquirer.prompt({
    name: 'overwrite',
    type: 'list',
    message: message,
    choices: ['Yes', 'Cancel']
  });

  if (answer.overwrite == 'Cancel') {
    console.log();
    process.exit();
  }

  fs.rmSync(localPath, { recursive: true, force: true });

  // Download quest
  console.log(chalk.green("\nDownloading quest..."));

  if (!fs.existsSync('./.credentials')) {
    console.log(CREDENTIALS_NOT_FOUND_MESSAGE);
    process.exit();
  }

  const token = fs.readFileSync(path.join(mainPath(), './.credentials')).toString();
  const authDownloader = new Downloader.Downloader({
    github: { auth: token }
  });

  await authDownloader.download('NodeGuardians', 'ng-quests-public', questPath);

  const relativePath = "./" + path.relative(mainPath(), localPath);
  console.log(chalk.green("Quest downloaded at ", chalk.bold(relativePath)));
  console.log();

}

