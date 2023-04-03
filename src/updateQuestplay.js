import chalk from 'chalk';
import child_process from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
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
  if (await isLatestVersion()) {
    console.log(chalk.yellow("Questplay is up-to-date.\n"));
    process.exit(0);
  }

  // (3) Pull update
  await pullUpdate();

  // (4) If git hook not installed, install pre-commit hook
  // Required for legacy reasons. Early versions of Questplay doesn't require installing our pre-commit hook.
  if (!fs.existsSync("./.git/hooks/pre-commit")) {
    const hookFile = path.join(process.cwd(), "hooks", "precommit.js");
    fs.symlinkSync(hookFile, "./.git/hooks/pre-commit");
  }

  // (5) Install dependencies and forge-std submodule
  child_process.execSync('npm install');
  await git.submoduleUpdate(["--init", "--recursive"]);

  console.log();

  try {

    await git.add("./*");
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

  await authDownloader.downloadDirectory('NodeGuardians', 'ng-questplay', "");

  console.log(chalk.green("\nInstalling Questplay..."));
  await authDownloader.installSubpackage();
}
