#!/usr/bin/env node
import { findQuest } from "./src/findQuest.js";
import {
  FIND_HELP_MESSAGE,
  MAIN_HELP_MESSAGE,
  TEST_HELP_MESSAGE,
  SUBMIT_HELP_MESSAGE,
  UPDATE_HELP_MESSAGE,
  BRIDGE_HELP_MESSAGE,
  SET_FRAMEWORK_HELP_MESSAGE,
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
import { Command } from "commander";

const program = new Command();

if (!process.cwd().startsWith(mainPath())) {
  console.log(TITLE);
  console.log(WRONG_DIRECTORY_MESSAGE);
  process.exit(1);
}

function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

program
  .name("Node Guardiands quest CLI")
  .description(
    "CLI to download and submit quests to the Node Guardians servers"
  )
  .version("0.0.1");

// program.addHelpText(MAIN_HELP_MESSAGE);

program
  .command("test")
  .description("Run local tests for the current quest")
  .option("[part]", "Part number of the quest to test", myParseInt)
  .exitOverride((err) => {
    console.log(TEST_HELP_MESSAGE);
  })
  .action(async (part) => {
    await runTests(part);
  });

program
  .command("set-framework")
  .description("Set the framework for the current quest")
  .argument("<framework>", "Framework to set : foundry or hardhat")
  .exitOverride((err) => {
    console.log(SET_FRAMEWORK_HELP_MESSAGE);
  })
  .action(async (framework) => {
    if (framework != "foundry" && framework != "hardhat") {
      console.log(chalk.red("\nERROR: Unrecognized framework"));
      return;
    }

    await setFramework(framework);
  });

program
  .command("find")
  .description("Find an download a quest")
  .argument("[slug]", "Slug of the quest to find")
  .exitOverride((err) => {
    console.log(FIND_HELP_MESSAGE);
  })
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
  .description("Bridge a quest to the Node Guardians servers")
  .argument("<hash>", "32 bytes hash")
  .exitOverride((err) => {
    console.log(BRIDGE_HELP_MESSAGE);
  })
  .action(async (hash) => {
    await bridge(hash);
  });

program
  .command("update")
  .description("Update the questplay repository")
  .option("--new-remote <remote>", "Set a new remote target for the questplay update")
  .exitOverride((err) => {
    console.log(UPDATE_HELP_MESSAGE);
  })
  .action(async (remote) => {
    await updateQuestplay(remote);
  });

program
  .command("submit")
  .description("Submit a build quest solution to the Node Guardians servers")
  .option("--set-upstream", "set the upstream branch alongside the submission")
  .option("--listen", "wait for the server response")
  .exitOverride((err) => {
    console.log(SUBMIT_HELP_MESSAGE);
  })
  .action(async (setUpstream, listen) => {
    await submitQuest(setUpstream, listen);
  });

program.parseAsync();