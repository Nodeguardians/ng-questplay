#!/usr/bin/env node
import chalk from "chalk";
import path from "path";
import { cwd } from "process";
import { navigateToQuestDirectory } from './utils/navigation.js';
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
    process.exit();
  }

  console.log();

  const statusSummary = await git.status()

  if (statusSummary.files.length) {
    console.log(UNCOMMITTED_FILES_MESSAGE);
    process.exit();
  }

  const branchSummaryResult = await git.branch()
  const currentBranch = branchSummaryResult.branches[branchSummaryResult.current]

  if (!isSetUpstream && await git.raw("ls-remote", "--exit-code", "--heads", "origin",  currentBranch.name) == "") {
    console.log(NoUpstreamBranchMessage(currentBranch.name));
    process.exit();
  }

  const progressBar = new ProgressBar();
  await progressBar.start();
  const questName = path.basename(cwd());

  try {

    await git.commit(`#${questName}`, [], ["--allow-empty"]);
    await git.push(["-u"]);

  } catch (err) {

    await progressBar.fail("Submission failed\n");
    process.exit();

  }

  await progressBar.stop("Pushed to Github");
  console.log(
    chalk.green(`Quest ${questName} submitted, your results will be available on nodeguardians.io in a few seconds.\n`)
  );

}