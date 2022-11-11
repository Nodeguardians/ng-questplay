import chalk from 'chalk';
import path from 'path';
import { cwd } from 'process';
import { mainPath } from './navigation.js';

const INITIAL_CWD = cwd();

export const TITLE = "\n\
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
  "\nQuest not found. Did you enter the correct name?\n"
  + "Check the name again or pull from upstream to fetch the latest directory of released quests.\n"
);

// TODO: Add link to FAQ page
export const CREDENTIALS_NOT_FOUND_MESSAGE = chalk.red(
  "\nGithub credentials not found.\n"
);

export const UPDATE_QUEST_CONFIRMATION =
  "Old version of quest detected in local repo. Update to latest version? \n"
  + chalk.bgBlackBright("Any of your existing work will be overwritten\n");

export const QUEST_ALREADY_EXISTS_MESSAGE =
  chalk.yellow("Latest version of quest already exists in local repo.\n");

export const MAIN_HELP_MESSAGE =
  chalk.gray("\nUsage: quest [<command>] [<args>]\n")
  + chalk.gray("\nManage your Node Guardians's quest repo using the `quest` command.\n\n")
  + chalk.cyan(
    chalk.bold("Commands:\n\n"),
    chalk.bold("  find"), "      Search for a specific quest in the repo\n",
    chalk.bold("  test"), "      Run local tests for the current quest\n",
    chalk.bold("  submit"), "    Submit quest to nodeguardians.io for verification\n",
    chalk.bold("  update"), "    Updates Questplay to the latest version\n\n")
  + chalk.cyan(
    chalk.bold("Options:\n\n"),
    chalk.bold("  --help"), "    Read the manual\n"
  );

export const TEST_HELP_MESSAGE =
  chalk.gray("\nUsage: quest test [<index>]\n"
    + "Example: quest test 1\n\n"
    + "Run a quest's local test(s). If the index is unspecified, test all parts.\n"
    + "Must be ran in a valid quest directory.\n\n"
  ) + chalk.cyan(chalk.bold("index:"), "    Part of quest to test (e.g. 1, 2, 3)\n");

export const FIND_HELP_MESSAGE =
  chalk.gray(
    "\nUsage: quest find [<name>]\n"
    + "Example: quest find using-signatures\n"
    + "\nFind a quest in the repository. Queries for a name if name is unspecified.\n\n"
  ) + chalk.cyan(chalk.bold("name:"), "    (Optional) Name of quest to find. [hypenated, no spacing]\n");

export const SUBMIT_HELP_MESSAGE =
  chalk.gray(
    "\nUsage: quest submit (--set-upstream)\n"
    + "\nSubmit a quest to nodeguardians.io for verification\n\n"
  ) + chalk.cyan(chalk.bold("--set-upstream:"), "    (Optional) Push a new branch upstream\n");

export const UPDATE_HELP_MESSAGE =
  chalk.gray(
    "\nUsage: quest update \n"
    + "\nUpdates Questplay to the latest version.\n"
  );

export const UNCOMMITTED_FILES_MESSAGE =
  chalk.yellow(
    "Uncommitted files detected. Questplay is unable to push to remote.\n"
    + "Try committing or stashing all changes first.\n");

export const UNCOMMITTED_FILES_BEFORE_UPDATE_MESSAGE =
  chalk.yellow(
    "Uncommitted files detected. Questplay is unable to update.\n"
    + "Try committing or stashing all changes first.\n");

export const UPDATE_REMINDER_MESSAGE =
  chalk.yellow(
    chalk.bold("\nIMPORTANT:"),
    "New version of Questplay available.\n"
    + "Run `quest update` to download update.\n"
  );

export function NoUpstreamBranchMessage(branchName) {
  return chalk.red(`Current branch : ${branchName} doesn't exist in remote\n`)
    + chalk.yellow("To push branch upstream, try running", chalk.bold("quest submit --set-upstream\n"));
}

export function NavigateToQuestMessage(questPath) {
  const relativePath = path.relative(INITIAL_CWD, questPath);
  return chalk.cyan(
    "To navigate to quest directory, run",
    chalk.bold(`cd ${relativePath}`),
    "\n"
  );
}