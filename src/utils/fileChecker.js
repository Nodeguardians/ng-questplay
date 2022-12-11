#!/usr/bin/env node
// import chalk from 'chalk';
import fs from 'fs';
import { mainPath, navigateToQuestDirectory } from './navigation.js';
import { simpleGit } from 'simple-git';
import path from 'path';
import { UnexpectedContractsWarning } from './messages.js';

const git = simpleGit();

function isContractPredicate(contractsPath) {
  return (filepath) => {
    return filepath.startsWith(contractsPath)
      && filepath.endsWith(".sol");
  }
}

export async function checkFilesToTest() {

  navigateToQuestDirectory();
  const questPath = path.relative(mainPath(), process.cwd());
  const contractsPath = path.join(questPath, "contracts");

  const {not_added, created, modified} = await git.status();
  const isContract = isContractPredicate(contractsPath);

  const fileToTestData = fs.readFileSync('./files-to-test.json');
  const filesToTest = JSON.parse(fileToTestData);

  const unexpectedNewContracts = not_added.concat(created)
    .filter(isContract)
    .map(filepath => path.relative(questPath, filepath))
    .filter(filepath => !filesToTest.includes(filepath));

  const unexpectedModifiedContracts = modified
    .filter(isContract)
    .map(filepath => path.relative(questPath, filepath))
    .filter(filepath => !filesToTest.includes(filepath));

  if (unexpectedNewContracts.length == 0 && unexpectedModifiedContracts == 0) {
    return;
  }

  const warning = UnexpectedContractsWarning(
    unexpectedNewContracts, unexpectedModifiedContracts, questPath
  );

  console.log(warning);
}

checkFilesToTest();