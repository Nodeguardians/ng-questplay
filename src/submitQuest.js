#!/usr/bin/env node
import chalk from "chalk";
import path from "path";
import { cwd } from "process";
import { navigateToQuestDirectory } from './utils/navigation.js';
import { ProgressBar } from './utils/progressbar.js'
import { simpleGit } from 'simple-git';

const git = simpleGit();

export async function submitQuest() {

  try {
    navigateToQuestDirectory();
  } 
  catch (error) {
    console.log(chalk.red(error));
    process.exit();
  }

  console.log();
  const progressBar = new ProgressBar();
  await progressBar.start();
  const questName = path.basename(cwd());

  const statusSummary = await git.status()
  let unclean = false;

  if (statusSummary.files.length) {
    await git.stash(["-u"])
    unclean = true
  }

  try {
    await git.commit(`#${questName}`, [], ["--allow-empty"]);
    await git.push(["-u"]);
  } catch (err) {

    if (unclean) { await git.stash(["pop"]); }

    await progressBar.fail("Submission failed\n");
    return;

  }

  if (unclean) {
    await git.stash(["pop"])
  }

  await progressBar.stop("Pushed to Github");
  console.log(
    chalk.green(`Quest ${questName} submitted, your results will be available on nodeguardians.io in a few seconds.\n`)
  );

}