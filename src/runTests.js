#!/usr/bin/env node
import chalk from 'chalk';
import path from 'path';
import { cwd } from 'process';
import { checkFilesToTest } from './utils/fileChecker.js';
import { getDirectory, navigateToQuestDirectory } from './utils/navigation.js';

export async function runTests(partIndex = undefined) {

  try {
    navigateToQuestDirectory();
  } catch (error) {
    console.log(chalk.red(error));
    process.exit(1);
  }

  const directory = getDirectory();
  const campaignName = path.basename(path.dirname(cwd()));
  const questName = path.basename(cwd());

  const questInfo = directory
    .find(c => c.name == campaignName)
    .quests.find(q => q.name == questName);

  if (questInfo.type == "ctf") {
    console.log(chalk.red("\nQuest is a CTF quest. No local tests to run.\n"));
    process.exit(0);
  }
  
  const hre = await import('hardhat');

  if (partIndex == undefined) {
    for (let i = 1; i <= questInfo.parts; i++) {
      const numFailed = await hre.default.run("test", { grep: `Part ${i}` });
      if (numFailed > 0) break;
    }
  } else {
    hre.default.run("test", { grep: `Part ${partIndex}` });
  }
  
  checkFilesToTest().catch((_) => {
    console.log(chalk.gray("WARNING: Check for files-to-test.json failed.\n"
      +  "Help report this via Discord! https://discord.com/invite/DxvUzcQe"));
  });

};