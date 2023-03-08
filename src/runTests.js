#!/usr/bin/env node
import chalk from 'chalk';
import path from 'path';
import commandExists from 'command-exists';
import { cwd } from 'process';
import { execSync, spawnSync } from 'child_process';
import fs from 'fs';

import { checkFilesToTest } from './utils/fileChecker.js';
import { getDirectory, navigateToQuestDirectory } from './utils/navigation.js';
import FoundryReport from './utils/foundryReport.js';
import { INSTALL_FOUNDRY_MESSAGE } from './utils/messages.js';

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

  const framework = JSON.parse(fs.readFileSync("./package.json")).framework;
  if (framework == "foundry") {
    await runFoundryTests( partIndex);
  } else {
    await runHardhatTests(questInfo.parts, partIndex);
  }

  checkFilesToTest().catch((_) => {
    console.log(chalk.gray("WARNING: Check for files-to-test.json failed.\n"
      +  "Help report this via Discord! https://discord.com/invite/DxvUzcQe"));
  });

};

async function runHardhatTests(numParts, partIndex) {

  const hre = await import('hardhat');

  if (partIndex == undefined) {
    for (let i = 1; i <= numParts; i++) {
      const numFailed = await hre.default.run("test", { grep: `Part ${i}` });
      if (numFailed > 0) break;
    }
  } else {
    await hre.default.run("test", { grep: `Part ${partIndex}` });
  }

}

async function runFoundryTests(partIndex) {

  console.log(chalk.grey("\nRunning Foundry tests..."));

  if (!commandExists.sync("forge")) {
    console.log(INSTALL_FOUNDRY_MESSAGE);
    process.exit(1);
  }

  const forgeParams = (partIndex == undefined)
    ? ["test", "--json"]
    : ["test", "--json", "--match-path", `*\.${partIndex}\.t\.sol`]

  let forgeProcess = spawnSync("forge", forgeParams);
  
  const stdout = forgeProcess.stdout.toString();

  if (forgeProcess.stderr.length > 0) {
    console.log(chalk.gray(stdout));
    console.log(forgeProcess.stderr.toString());
    process.exit(1);
  }

  const outputLines = stdout.split('\n')
  for (let i = 0; i < outputLines.length - 2; i++) {
    console.log(chalk.gray(`  [${chalk.green("\u283f")}] ` + outputLines[i]));
  }

  const jsonString = outputLines[outputLines.length - 2]
  const report = new FoundryReport(JSON.parse(jsonString));
  await report.print(20);

}