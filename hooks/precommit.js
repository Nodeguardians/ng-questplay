#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import simpleGit from "simple-git";
import { UnexpectedContractsWarning } from '../src/utils/messages.js';
import { campaignPath, mainPath as getMainPath } from '../src/utils/navigation.js';

/// Returns true if the given filepath is in a quest's src folder.
function isInSrcFolder(filepath) {
    "[<campaign-slug>, <quest-slug>, ...]"
    const relativePath 
        = path.relative(campaignPath(), filepath).split(path.sep);

    if (relativePath.length < 3) {
        return false;
    }

    const folderName = relativePath[2];

    return folderName == "src" || folderName == "contracts";
}

function isWhitelisted(contractPath, mainPath) {

    const filesToTestPath = path.join(
        mainPath,
        contractPath.replace(/(contracts|src).*/, "files-to-test.json"),
    );
    
    if (!fs.existsSync(filesToTestPath)) {
        return true;
    }

    const filesToTestData = fs.readFileSync(filesToTestPath);
    const filesToTest = JSON.parse(filesToTestData);

    const localContractPath = contractPath.replace(/.*(?=(contracts|src))/, "");

    return filesToTest.includes(localContractPath);

}

function findUnexpected(contractFiles) {

    const mainPath = getMainPath();

    return contractFiles
        .filter(isInSrcFolder)
        .filter(contractPath => !contractPath.includes("plonk_vk.sol"))
        .filter(contractPath => !isWhitelisted(contractPath, mainPath));
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