import chalk from "chalk";
import path from "path";
import { cwd } from "process";
import { mainPath } from "./navigation.js";

const INITIAL_CWD = cwd();

export const TITLE =
  "\n\
      ,,\n\
        ╙█▓,\n\
          └██▄      ╙██▌    ▄██▀╙──╙▀██▄    ███▀╙╙╙▀██▄    └███╙╙╙╙▀\n\
          ████▄     ██▌   ███        ███   ╫██─     ╙██▄   ███\n\
          ███ ▀█▄   ██▌  ███▌        ▐██▌  ╫██─      ███   ███   ▄\n\
          ███   ▀█▄ ██▌  ███▌        ▐██▌  ╫██─      ███   ███└└└╙\n\
          ███     ▀███▌   ███        ███   ╫██─     ▄██▀   ███\n\
          ███       ▀██    ╙▀█▄╓ ,╓▄█▀▀    ███▄╓╓▄▄██▀    ,███╓╓▄▄▓▌\n\
                      ╙█▄       ──\n\
                        └╙▀▀`\n\
\n\
▄▓▀╙└`▀▓   ██    j▌    ▓▄     ██`▀█▌   ██└└▀▀▄   ██─    ▄▄     █,    ██  ╓█╙└▀─\n\
▓█─        ██    j▌   ▓▀█▄    ██  ██   ██    ╟█µ ╫█    ▄▀█▄    ███▄  ██  ╙█▓▄\n\
██     ▐█▌ ██    j▌  ▄▌,██▄   ██ ██,   ██    ╟█▌ ╫█   ▄▌,██▄   █▌ └▀▄██    ╙▀██\n\
▀█▄   ▓█▌  ▀█▄  ,▓─ ▄▀   ██▄  ██  ██▌  ██   ▄█▀  ╫█─ ▄▌   ██▄  █▌    ▀█  █   ╟█\n\
──  ▀█▄    ──                                                           ──\n\
";

export const WRONG_DIRECTORY_MESSAGE = chalk.red(
  "\n`quest` must be run from the ng-quests directory\n",
  `Try running: \"cd ${mainPath().replace(" ", "\\ ")}\"\n`
);

export const QUEST_NOT_FOUND_MESSAGE = chalk.yellow(
  "\nQuest not found. Did you enter the correct name?\n" +
    "Check the name again or run `quest update` to fetch the latest directory of released quests.\n"
);

export const BAD_TOKEN_MESSAGE = chalk.red(
  "\nBad Github token.\n"
);

export const UPDATE_QUEST_CONFIRMATION =
  "Old version of quest detected in local repo. Update to latest version? \n" +
  chalk.bgBlackBright("Any of your existing work will be overwritten\n");

export const QUEST_ALREADY_EXISTS_MESSAGE = chalk.yellow(
  "Latest version of quest already exists in local repo.\n"
);

export const UNCOMMITTED_FILES_MESSAGE = chalk.yellow(
  "Uncommitted files detected. Questplay is unable to push to remote.\n" +
    "Try committing or stashing all changes with git first.\n"
);

export const UNCOMMITTED_FILES_BEFORE_UPDATE_MESSAGE = chalk.yellow(
  "Questplay is unable to update when there are still uncommitted files in the repository.\n" +
    "Try committing or stashing all changes with git first.\n"
);

export const UNCOMMITTED_FILES_BEFORE_DOWNLOAD_MESSAGE = chalk.yellow(
  "Questplay is unable to download a quest when there are still uncommitted files in the repository.\n" +
    "Try committing or stashing all changes with git first.\n"
);

export const UPDATE_REMINDER_MESSAGE = chalk.yellow(
  chalk.bold("\nIMPORTANT:"),
  "New version of Questplay available.\n" +
    "Run `quest update` to download update.\n"
);

export function NoUpstreamBranchMessage(branchName) {
  return (
    chalk.red(`Current branch : ${branchName} doesn't exist in remote\n`) +
    chalk.yellow(
      "To push branch upstream, try running",
      chalk.bold("quest submit --set-upstream\n")
    )
  );
}

export function NavigateToQuestMessage(questPath) {
  const relativePath = path.relative(INITIAL_CWD, questPath);
  return chalk.cyan(
    "To navigate to quest directory, run",
    chalk.bold(`cd ${relativePath}`),
    "\n"
  );
}

export function UnexpectedContractsWarning(
  newContracts,
  modifiedContracts,
  filesToTestPath = undefined
) {
  let msg =
    chalk.yellow("WARNING: ") +
    "Questplay has detected unexpectedly added/modified files.\n\n";

  for (const newContract of newContracts)
    msg += chalk.bold(`     Added: ${newContract}\n`);

  for (const modifiedContract of modifiedContracts)
    msg += chalk.bold(`  Modified: ${modifiedContract}\n`);

  msg +=
    "\nIf your solution is dependent on any these changes, consider moving them.";

  if (filesToTestPath)
    msg += `\nSee ${chalk.bold(
      filesToTestPath
    )} for the files you can safely modify.`;

  return chalk.gray(msg);
}

export const INSTALL_FOUNDRY_MESSAGE =
  chalk.grey(
    "Foundry is a lightweight development toolkit, and a rising alternative to Hardhat.\nRunning Foundry tests requires additional installation.\n\n"
  ) +
  chalk.cyan(
    `To install Foundry, refer to ${chalk.bold(
      "https://book.getfoundry.sh/getting-started/installation"
    )}.\n`
  );

export function INSTALL_FORGE_LIB_MESSAGE() {
  return chalk.yellow(
    "Foundry tests require the forge-std submodule to be initialized. Run the following:\n\n",
    chalk.bold(`    cd ${mainPath()}\n`),
    chalk.bold(
      "    git submodule add  https://github.com/foundry-rs/forge-std lib/forge-std\n"
    ),
    chalk.bold("    git submodule update --init --recursive\n")
  );
}

export const UPDATE_FOUNDRY_MESSAGE = chalk.yellow(
  "Outdated version of Forge detected. To update, run:\n",
  chalk.bold("    foundryup\n")
);

export const UPDATE_FORGE_LIB_MESSAGE = chalk.yellow(
  "Outdated version of forge-std detected. To update, run:\n",
  chalk.bold("    git submodule update --remote --recursive\n")
);

export const FOUNDRY_NOT_SUPPORTED_MESSAGE = chalk.yellow(
  "This quest does not support Foundry, running Hardhat instead...\n"
);

export function INSTALL_SCARB_MESSAGE(remoteVersion) {
    return chalk.yellow(
      `Cairo quests require the installation of Scarb ${remoteVersion}. To install Scarb, check out`,
      chalk.underline("https://docs.swmansion.com/scarb/\n")
    );
}

export function MISMATCH_SCARB_MESSAGE(remoteVersion) {
  return chalk.yellow(`Incompatible scarb version detected. Please use scarb ${remoteVersion}!\n`);
}

export function UPDATE_CAIRO_MESSAGE(localVersion, remoteVersion) {
    let removeChange = chalk.bgRed(chalk.strikethrough(`"${localVersion}"`));
    let addChange = chalk.bgGreenBright(`"${remoteVersion}"`);

    return chalk.yellow(`We have migrated to cairo ${remoteVersion}! Migrate your quest by making the following changes to Scarb.toml:\n`)
    + chalk.grey(`\n    cairo-version = ${removeChange} ${addChange}`)
    + chalk.grey(`\n\n    [dependencies]`)
    + "\n    " + chalk.bgGreen(`cairo_test = "${remoteVersion}"`)
    + chalk.grey(`\n    starknet = ${removeChange} ${addChange} [if applicable]\n`)
    + chalk.yellow("\nOR delete and re-install the quest! (Remember to save your progress elsewhere first)\n");

}

export const UPDATE_SCARB_VERSION_FAIL = 
  chalk.yellow(
    "WARNING: Failed to detect Scarb version.\n",
    "Consider reporting this on Discord!\n",
    chalk.underline("https://discord.gg/EyGQEEzmjx\n")
  );

export function INSTALL_NARGO_MESSAGE(remoteVersion) {
  return chalk.yellow(
    `Noir quests require the installation of Nargo ${remoteVersion}. To install Nargo, check out`,
    chalk.underline("https://noir-lang.org/getting_started/nargo_installation/\n")
  );
}

export function MISMATCH_NARGO_MESSAGE(remoteVersion) {
  return chalk.yellow(`Incompatible nargo version detected. Please use nargo ${remoteVersion}!\n`);
}

export function INSTALL_HUFFC_MESSAGE(remoteVersion) {
  return chalk.yellow(
    `Huff quests require the installation of huffc ${remoteVersion}. To install huffc, check out`,
    chalk.underline("https://docs.huff.sh/get-started/installing/\n")
  );
}

export function MISMATCH_HUFFC_MESSAGE(remoteVersion) {
  return chalk.yellow(`Incompatible huffc version detected. Please use huffc ${remoteVersion}!\n`);
}

export function MISMATCH_NODE_MESSAGE(remoteVersion) {
  const CEILING = "\n╒══════════════════════════════════════════════════════════════════════════════╕\n";
  const FLOOR = "╘══════════════════════════════════════════════════════════════════════════════╛\n";

  return chalk.yellow(
    CEILING
    + `  Incompatible node version detected. Please use node ${remoteVersion}!\n`
    + `  If you're using nvm, you can run 'nvm use' to switch to the correct version.\n`
    + FLOOR
  );
}

export const SUBMISSION_ERROR_BANNER = chalk.yellow(
  "\nWARNING: An error occurred during the verification of your submission.\n",
  "Consider reporting this on Discord if this is not linked to your implementation.\n",
  chalk.underline("https://discord.gg/EyGQEEzmjx\n")
);

export const SUBMISSION_FAILED_BANNER = chalk.red(
  "\nERROR: We couldn't validate your submission due to the following error\n",
  "Please report this error on Discord: " +
    chalk.underline("https://discord.gg/EyGQEEzmjx\n")
);

export const UPDATE_ABORTED_MESSAGE = chalk.red("\nUpdate aborted.\n") 
  + chalk.red("To continue with update, run `npm install`\n");
