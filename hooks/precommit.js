#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import simpleGit from "simple-git";
import { UnexpectedContractsWarning } from '../src/utils/messages.js';
import { mainPath as getMainPath } from '../src/utils/navigation.js';

function isWhitelisted(contractPath, mainPath) {

    const filesToTestPath = path.join(
        mainPath,
        contractPath.replace(/contracts.*sol/, "files-to-test.json"),
    );

    if (!fs.existsSync(filesToTestPath)) {
        return true;
    }

    const filesToTestData = fs.readFileSync(filesToTestPath);
    const filesToTest = JSON.parse(filesToTestData);
    
    const localContractPath = contractPath.replace(/.*(?=contracts)/, "");

    return filesToTest.includes(localContractPath);

}

function findUnexpected(contractFiles) {

    const mainPath = getMainPath();

    return contractFiles
        .filter(filepath => filepath.endsWith(".sol"))
        .map(contractPath => path.join(process.cwd(), contractPath))
        .map(contractPath => contractPath.substring(mainPath.length))
        .filter(contractPath => !isWhitelisted(contractPath, mainPath))
        .map(contractPath => path.relative("/campaigns", contractPath));

}

async function main() {
  const git = simpleGit();

  const statusSummary = await git.status();

  const unexpectedAdded = findUnexpected(statusSummary.created);
  const unexpectedModded = findUnexpected(statusSummary.modified);

  if (unexpectedAdded.length > 0 || unexpectedModded.length > 0) {
      console.log();
      console.log(UnexpectedContractsWarning(unexpectedAdded, unexpectedModded));
      console.log();
  }
}

main().catch((_) => {
  console.log(chalk.gray("WARNING: Check for files-to-test.json failed.\n"
    +  "Help report this via Discord! https://discord.com/invite/DxvUzcQe"));
});