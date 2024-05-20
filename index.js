#!/usr/bin/env node
import { findQuest } from "./src/findQuest.js";
import {
  TITLE,
  WRONG_DIRECTORY_MESSAGE,
} from "./src/utils/messages.js";
import { runTests, setFramework } from "./src/runTests.js";
import { mainPath } from "./src/utils/navigation.js";
import chalk from "chalk";
import inquirer from "inquirer";
import { submitQuest } from "./src/submitQuest.js";
import { updateQuestplay } from "./src/updateQuestplay.js";
import { bridge } from "./src/bridge.js";
import { Command, Option } from "commander";
import { runGolf } from "./src/runGolf.js";
import { checkNodeVersion } from "./src/utils/versions.js";

const program = new Command();

function myParseInt(value, dummyPrevious) {
    // parseInt takes a string and a radix
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      throw new commander.InvalidArgumentError('Not a number.');
    }
    return parsedValue;
  }

checkNodeVersion();

if (!process.cwd().startsWith(mainPath())) {
  console.log(TITLE);
  console.log(WRONG_DIRECTORY_MESSAGE);
  process.exit(1);
}

program
  .name("quest")
  .description(
    "CLI application to manage Node Guardians quests."
  );

program.configureOutput({
    writeOut: (str) => {
        // For help messages:
        // commander.js adds [options] in usage example, just for `--help`
        // This might be confusing for users.
        if (str.startsWith("Usage:")) {
            str = str.replace(" [options]", "");
        };
        process.stdout.write(chalk.grey(`\n${str}\n`));
    },
    writeErr: (str) => process.stdout.write(chalk.red(`\n${str}\n`))
});

program
  .command("test")
  .description("Run a quest's local test(s). If the index is unspecified, test all parts.\n" +
  "Must be ran in a valid quest directory.")
  .argument("[index]", "Part of quest to test (e.g. 1, 2, 3)", myParseInt)
  .allowExcessArguments(false)
  .action(async (part) => {
    await runTests(part);
  });

program
  .command("set-framework")
  .description("Set the default testing framework for local tests.")
  .argument("<framework>", "Framework of choice [hardhat | foundry]")
  .allowExcessArguments(false)
  .action(async (framework) => {
    if (framework != "foundry" && framework != "hardhat") {
      console.log(chalk.red("\nerror: Unrecognized framework"));
      return;
    }

    await setFramework(framework);
  });

program
  .command("find")
  .description("Find a quest in the repository. Queries for a name if name is unspecified.")
  .argument("[name]", "Name of quest to find.")
  .allowExcessArguments(false)
  .action(async (slug) => {
    if (slug === undefined) {
      const answers = await inquirer.prompt({
        name: 'query',
        type: 'input',
        message: 'Find a quest:'
      });

      slug = answers.query.toLowerCase().trim().replace(" ", "-");
    }
    await findQuest(slug);
  });

program
  .command("bridge")
  .description("Query bridge signer for a signature.")
  .argument("<bridge-hash>", "32-byte bridge hash obtained from quest's contract")
  .allowExcessArguments(false)
  .action(async (hash) => {
    await bridge(hash);
  });

program
  .command("update")
  .description("Update Questplay to the latest version.")
  .option("--new-remote <remote>", "Set a new remote target")
  .allowExcessArguments(false)
  .action(async (options) => {
    await updateQuestplay(options.newRemote);
  });

const envOption = new Option("--env <name>")
  .choices(["prod", "preprod", "staging"])
  .default("prod")
  .hideHelp();

program
  .command("submit")
  .description("Submit a quest to nodeguardians.io for verification.")
  .option("--set-upstream", "Push a new branch upstream")
  .option("--listen", "Listen for server response")
  .addOption(envOption)
  .allowExcessArguments(false)
  .action(async (options) => {
    await submitQuest(options.setUpstream, options.listen, options.env);
  });

program
  .command("golf")
  .description("Run golfing tests.")
  .allowExcessArguments(false)
  .action(async () => {
    await runGolf();
  });

if (process.argv.length == 2) {
    console.log(TITLE);
    // Add colour
    let helpInformation = chalk.grey(program.helpInformation()
        .replace(/Options(.|\n|)*$/, (match, _) => chalk.cyan(match)));
    // Remove [options] from usage example
    helpInformation = helpInformation.replace(" [options]", "");
    console.log(helpInformation);

    process.exit(0);
}

program.parseAsync();