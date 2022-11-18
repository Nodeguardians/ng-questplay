#!/usr/bin/env node
import chalk from "chalk";
import path from "path";
import { cwd } from "process";
import { getDirectory, navigateToQuestDirectory } from './utils/navigation.js';
import { ProgressBar } from './utils/progressbar.js'
import { simpleGit } from 'simple-git';
import { NoUpstreamBranchMessage, UNCOMMITTED_FILES_MESSAGE } from "./utils/messages.js";

const git = simpleGit();

export async function submitQuest(isSetUpstream) {

  try {
    navigateToQuestDirectory();
  } 
  catch (error) {
    console.log(chalk.red(error));
    process.exit(1);
  }

  console.log();

  const directory = getDirectory();
  const campaignName = path.basename(path.dirname(cwd()));
  const questName = path.basename(cwd());

  const questInfo = directory
    .find(c => c.name == campaignName)
    .quests.find(q => q.name == questName);

  if (questInfo.type == "ctf") {
    console.log(chalk.yellow("Quest is a CTF quest. No need to submit via Questplay.\n"));
    process.exit(0);
  }

  const statusSummary = await git.status()

  if (statusSummary.files.length) {
    console.log(UNCOMMITTED_FILES_MESSAGE);
    process.exit(1);
  }

  const branchSummaryResult = await git.branch()
  const currentBranch = branchSummaryResult.branches[branchSummaryResult.current]

  if (!isSetUpstream && await git.raw("ls-remote", "--exit-code", "--heads", "origin",  currentBranch.name) == "") {
    console.log(NoUpstreamBranchMessage(currentBranch.name));
    process.exit(1);
  }

  const progressBar = new ProgressBar();
  await progressBar.start();

  try {

    await git.commit(`#${questName}`, [], ["--allow-empty"]);
    await git.push(["-u", "origin", currentBranch.name]);

  } catch (err) {

    await progressBar.fail("Submission failed\n");
    process.exit(1);

  }

  await progressBar.stop("Pushed to Github");
  console.log(
    chalk.green(`Quest ${questName} submitted, your results will be available on nodeguardians.io in a few seconds.\n`)
  );

}