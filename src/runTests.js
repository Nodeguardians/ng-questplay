import chalk from 'chalk';
import path from 'path';
import { cwd } from 'process';
import { spawnSync } from 'child_process';

import TestHelpers from '@ngquests/test-helpers';
import { checkFilesToTest } from './utils/fileChecker.js';
import { 
  FOUNDRY_BETA_MESSAGE, 
} from './utils/messages.js';
import { 
  getQuestMetadata, 
  navigateToQuestDirectory, 
  readSettings, 
  writeSettings 
} from './utils/navigation.js';
import { checkForgeVersion } from './utils/versions.js';

const { FoundryReport } = TestHelpers;

export async function setFramework(framework) {
  if (framework != "hardhat" && framework != "foundry") {
    console.log(chalk.red(`\nInvalid framework: ${framework}\n`));
    process.exit(1);
  }

  let settings = readSettings();
  settings.framework = framework;
  writeSettings(settings);

  console.log();
  if (!checkForgeVersion()) {
    console.log(chalk.cyan("Then, run `quest set-framework foundry` to try again.\n"));
    return;
  }

  console.log(chalk.cyan(`Preferred framework set to ${framework}.\n`));
}

export async function runTests(partIndex = undefined) {

  try {
    navigateToQuestDirectory();
  } catch (error) {
    console.log(chalk.red(error));
    process.exit(1);
  }

  const campaignName = path.basename(path.dirname(cwd()));
  const questName = path.basename(cwd());

  const questMetadata = getQuestMetadata(campaignName, questName);
  
  if (questMetadata == null) {
    console.log(chalk.red("\nQuest not found. Did you rename any quest-level folder?"));
    process.exit(1);
  }

  if (partIndex > questMetadata.parts) {
    console.log(chalk.yellow(`\nPart ${partIndex} does not exist in this quest.\n`));
    process.exit(1);
  }

  if (questMetadata.type == "ctf") {
    console.log(chalk.red("\nQuest is a CTF quest. No local tests to run.\n"));
    process.exit(0);
  }

  // TODO: Scale this to be multi-protocol friendly
  if (questMetadata.lang == "cairo") {
    await runCairoTests(partIndex);
  } else if (readSettings().framework == "foundry") {
    await runFoundryTests(partIndex);
  } else {
    await runHardhatTests(questMetadata.parts, partIndex);
  }

  checkFilesToTest().catch((_) => {
    console.log(chalk.gray("WARNING: Check for files-to-test.json failed.\n"
      +  "Help report this via Discord! https://discord.com/invite/DxvUzcQe"));
  });

};

async function runCairoTests(partIndex) {

  const cairoTestParams = (partIndex == undefined)
  ? ["run", "test"]
  : ["run", "test", "--", "-f", `test_${partIndex}`]

  console.log();
  spawnSync("scarb", cairoTestParams, {stdio: "inherit"});
  console.log();
}

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

  console.log();
  if (!checkForgeVersion()) process.exit(1);

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