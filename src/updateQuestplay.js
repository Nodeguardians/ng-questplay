import chalk from 'chalk';
import child_process from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { navigateToMainDirectory, readSettings, writeSettings } from './utils/navigation.js';
import { QuestDownloader } from './utils/downloader.js';
import { simpleGit } from 'simple-git';

import { 
  CREDENTIALS_NOT_FOUND_MESSAGE, 
  UNCOMMITTED_FILES_BEFORE_UPDATE_MESSAGE
} from './utils/messages.js';
import { isLatestVersion, remoteVersion } from './utils/versions.js';

const git = simpleGit();

export async function updateQuestplay(newRemote = null) {

  navigateToMainDirectory();
  console.log();

  if (newRemote) {
    let settings = readSettings();
    settings.remote = newRemote;
    writeSettings(settings);
  }
  
  // (1) Ensure all changes saved
  const statusSummary = await git.status()
  if (statusSummary.files.length) {
    console.log(UNCOMMITTED_FILES_BEFORE_UPDATE_MESSAGE);
    process.exit(1);
  }

  // (2) Look for update
  if (await isLatestVersion()) {
    console.log(chalk.yellow("Questplay is up-to-date.\n"));
    process.exit(0);
  }

  // (3) Pull update
  await pullUpdate();

  // (4) Update pre-commit hook
  const hookFile = path.join(process.cwd(), "hooks", "pre-commit");
  fs.copyFileSync(hookFile, "./.git/hooks/pre-commit");

  // (5) Install dependencies and forge-std submodule
  child_process.execSync('npm install');
  await git.submoduleUpdate(["--init", "--recursive"]);

  console.log();

  try {

    await git.add("--all");
    await git.commit(`Update Questplay to ${await remoteVersion()}`);
    console.log(chalk.green("\nUpdate committed.\n"));

  } catch (err) {

    console.log(chalk.grey("\ngit commit failed. Try manually committing the Questplay update.\n"));
    process.exit(0);

  }

}

async function pullUpdate() {

  console.log(chalk.green("\nUpdating Questplay..."));

  dotenv.config({ path: './.env' });
  const token = process.env.GITHUB_TOKEN;
  if (token == undefined) {
    console.log(CREDENTIALS_NOT_FOUND_MESSAGE);
    process.exit(1);
  }

  const authDownloader = new QuestDownloader({
    github: { auth: token }
  });

  const remoteBranch = readSettings().remote;
  const options = remoteBranch == undefined ? {} : { sha: remoteBranch };

  await authDownloader.downloadQuestplay(options);

  console.log(chalk.green("\nInstalling Questplay..."));
  await authDownloader.installSubpackage();
}
