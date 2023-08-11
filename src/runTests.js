import chalk from 'chalk';

import { checkFilesToTest } from './utils/fileChecker.js';
import { 
  navigateToQuestDirectory, 
  readSettings, 
  writeSettings 
} from './utils/navigation.js';
import { checkForgeVersion } from './utils/versions.js';
import { currentWorkingQuest } from './quest/index.js';

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

    const quest = currentWorkingQuest();
    if (quest == null) {
        console.log(chalk.red("\nQuest not found. Did you rename any quest-level folder?"));
        process.exit(1);
    }

    await quest.test(partIndex);

    checkFilesToTest().catch((_) => {
        console.log(chalk.gray("WARNING: Check for files-to-test.json failed.\n"
        +  "Help report this via Discord! https://discord.com/invite/DxvUzcQe"));
    });

};