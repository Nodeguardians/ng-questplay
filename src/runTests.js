#!/usr/bin/env node
import chalk from 'chalk';
import { navigateToQuestDirectory } from './utils.js';

export async function runTests(partIndex = undefined) {

  try {
    navigateToQuestDirectory();
  } catch (error) {
    console.log(chalk.red(error));
    process.exit();
  }

  const hre = await import('hardhat');

  if (partIndex == undefined) {
    hre.default.run("test");
  } else {
    hre.default.run("test", { grep: `Part ${partIndex}` });
  }
  
};