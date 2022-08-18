#!/usr/bin/env node
import { findQuest } from './src/findQuest.js';
import { FIND_HELP_MESSAGE, MAIN_HELP_MESSAGE, TEST_HELP_MESSAGE, TITLE, WRONG_DIRECTORY_MESSAGE } from './src/messages.js';
import { runTests } from './src/runTests.js';
import { mainPath } from './src/utils.js';
import chalk from 'chalk';
import inquirer from 'inquirer';

const commands = process.argv.slice(2);

if (!process.cwd().startsWith(mainPath())) {
  console.log(TITLE);
  console.log(WRONG_DIRECTORY_MESSAGE);
  process.exit();
}

if (commands.length == 0) {
  console.log(TITLE);
  console.log(MAIN_HELP_MESSAGE);
  process.exit();
}

switch (commands[0]) {

  case '--help':
    console.log(MAIN_HELP_MESSAGE);

    break;
  case 'test':

    if (commands.includes("--help")) {
      console.log(TEST_HELP_MESSAGE);
      process.exit();
    }
    const partIndex = commands[1];

    if ((partIndex != undefined && !Number.isInteger(Number(partIndex)))
        || commands.length > 3) {
      console.log(chalk.red("\nERROR: Unrecognized parameter(s)"));
      console.log(TEST_HELP_MESSAGE);
      process.exit();
    }

    await runTests(commands[1]);
    break;

  case 'find':

    if (commands.includes("--help")) {
      console.log(FIND_HELP_MESSAGE);
      process.exit();
    }

    if (commands.length > 2) {
      console.log(chalk.red("\nERROR: Unrecognized parameter(s)"));
      console.log(FIND_HELP_MESSAGE);
      process.exit();
    }

    console.log();

    let searchQuery;
    if (commands.length < 2) {
      const answers = await inquirer.prompt({
        name: 'query',
        type: 'input',
        message: 'Find a quest:'
      });

      searchQuery = answers.query.toLowerCase().trim().replace(" ", "-");
    } else {
      searchQuery = commands[1];
    }

    findQuest(searchQuery);

    break;

  default:
    console.log(chalk.red('\nERROR: Unrecognized command'));
    console.log(MAIN_HELP_MESSAGE);

    break;

}
