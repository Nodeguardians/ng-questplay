import chalk from 'chalk';
import path from 'path';
import commandExists from 'command-exists';
import fs from 'fs';
import { cwd } from 'process';
import { spawnSync } from 'child_process';

import TestHelpers from '@ngquests/test-helpers';
import { checkFilesToTest } from './utils/fileChecker.js';
import { 
  FOUNDRY_BETA_MESSAGE, 
  INSTALL_FOUNDRY_MESSAGE,
  INSTALL_FORGE_LIB_MESSAGE,
  FOUNDRY_NOT_SUPPORTED_MESSAGE
} from './utils/messages.js';
import { 
  getDirectory, 
  mainPath, 
  navigateToQuestDirectory, 
  readSettings, 
  writeSettings 
} from './utils/navigation.js';

const { FoundryReport } = TestHelpers;

export async function setFramework(framework) {
  if (framework != "hardhat" && framework != "foundry") {
    console.log(chalk.red(`\nInvalid framework: ${framework}\n`));
    process.exit(1);
  }

  let settings = readSettings();
  settings.framework = framework;
  writeSettings(settings);

  console.log(chalk.gray(`\nPreferred framework set to ${framework}.\n`));

  if (framework == "foundry") {
    const forgeLibPath = path.join(mainPath(), "lib", "forge-std", "README.md");
    if (!fs.existsSync(forgeLibPath)) {
      console.log(INSTALL_FORGE_LIB_MESSAGE);
    }
  }
}

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
  
  if (questInfo == undefined) {
    console.log(chalk.red("\nQuest not found. Did you rename any quest-level folder?"));
    process.exit(0);
  }

  if (questInfo.type == "ctf") {
    console.log(chalk.red("\nQuest is a CTF quest. No local tests to run.\n"));
    process.exit(0);
  }

  if (readSettings().framework == "foundry") {
    await runFoundryTests(questInfo.parts, partIndex);
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

async function runFoundryTests(numParts, partIndex) {

  console.log();
  if (!fs.existsSync("./foundry.toml")) {
    console.log(FOUNDRY_NOT_SUPPORTED_MESSAGE);
    runHardhatTests(numParts, partIndex);
    return;
  }

  if (!commandExists.sync("forge")) {
    console.log(INSTALL_FOUNDRY_MESSAGE);
    process.exit(1);
  }

  console.log(FOUNDRY_BETA_MESSAGE);
  console.log(chalk.grey("\nRunning Foundry tests..."));

  const forgeParams = (partIndex == undefined)
    ? ["test", "--json"]
    : ["test", "--json", "--match-path", `*\.${partIndex}\.t\.sol`]

  let forgeProcess = spawnSync("forge", forgeParams);
  
  const stdout = forgeProcess.stdout.toString();

  const outputLines = stdout.split('\n');
  let jsonString = "";

  const isJson = new RegExp(/^{.+}$/);
  for (let i = 0; i < outputLines.length; i++) {

    if (isJson.test(outputLines[i])) {
      jsonString = outputLines[i];
    } else {
      const prefix = (i < 3) && (outputLines[i].length > 0)
        ? `  [${chalk.green("\u283f")}] ` 
        : "     ";
      console.log(chalk.grey(prefix + outputLines[i]));
    }
  }

  if (forgeProcess.stderr.length > 0) {
    const stderr = forgeProcess.stderr.toString();
    const errLines = stderr.split('\n');

    for (const errLine of errLines) {
      console.log("     " + errLine);
    }

    process.exit(1);
  }

  if (jsonString == "") return;
  const report = new FoundryReport(JSON.parse(jsonString));
  await report.print(20);

}