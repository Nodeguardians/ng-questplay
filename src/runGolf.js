import asciichart from 'asciichart';
import chalk from 'chalk';

import fs from 'fs';
import { 
  navigateToQuestDirectory
} from './utils/navigation.js';
import { currentWorkingQuest } from './quest/index.js';
import {
  createSpinner,
  startSpinner,
  stopSpinner,
  succeedSpinner,
} from "./utils/spinner.js";
import { exec } from 'child_process';
import { promisify } from 'util';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function printResults(metricName) {
  const history = JSON.parse(fs.readFileSync('history.json'));

  const metricHistory = history[metricName];

  const metricBest = history.best[metricName]

  const latestHistory = metricHistory.slice(-16);
  const latestMax = Math.max(...latestHistory);
  const latestMin = Math.min(...latestHistory);

  const padLength = latestMax.toString().length;

  const labelFormat = (x, i) => {
    if (x == latestMax || x == latestMin) {
      return x.toString().padStart(padLength);
    } else {
      return " ".repeat(latestMax.toString().length);
    }
  }

  const graph = asciichart.plot(latestHistory, { 
    height: 5,
    format: labelFormat,
    colors: [ asciichart.blue ]
  });

  console.log();
  console.log(chalk.gray(graph));

  const lastIndex = metricHistory.length - 1;
  const lastValue = metricHistory[lastIndex];
  if (metricHistory.indexOf(metricBest) == lastIndex) {
    console.log(chalk.gray(`\nCurrent Gas: ${chalk.blue(lastValue)} (NEW BEST)`));
  } else {
    console.log(chalk.gray(`\nCurrent Gas: ${chalk.blue(lastValue)}`));
  }

  console.log(chalk.gray(` Lowest Gas: ${chalk.blue(metricBest)}`));
  console.log();
}

export async function runGolf() {

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

  console.log();
  const spinner = createSpinner();
  startSpinner(spinner, "Analyzing mana consumption...\n");

  // Run metrics.js
  try {
    // Run asynchronously so spinner can spin
    const execPromise = promisify(exec);
    const result = await execPromise("npm run metrics", { stdio: [] });
  } catch (error) {
    stopSpinner(spinner);
    console.log(`${chalk.red("✗")} Your spell missed its target!`);
    console.log(chalk.gray("Run `quest test` to check for correctness first.\n"));
    process.exit(1);
  }

  succeedSpinner(spinner, "Mana consumption analyzed");
  await sleep(400);

  // Print results
  printResults("gasConsumption");
}