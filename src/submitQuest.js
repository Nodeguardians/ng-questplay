import chalk from "chalk";
import { navigateToQuestDirectory } from "./utils/navigation.js";
import { ProgressBar } from "./utils/progressbar.js";
import { simpleGit } from "simple-git";
import { currentWorkingQuest } from "./quest/index.js";
import {
  NoUpstreamBranchMessage,
  SUBMISSION_ERROR_BANNER,
  SUBMISSION_FAILED_BANNER,
  UNCOMMITTED_FILES_MESSAGE,
} from "./utils/messages.js";
import { getToken } from "./utils/token.js";
import {
  getWsClient,
  waitTopicMessage,
  waitTopicEventMessage,
  waitExclusiveTopicEventsMessage,
} from "./utils/websocket.js";
import { printPart } from "./utils/report.js";
import {
  createSpinner,
  startSpinner,
  stopSpinner,
  succeedSpinner,
} from "./utils/spinner.js";

const git = simpleGit();

export async function submitQuest(isSetUpstream, isListening, environment) {
  try {
    navigateToQuestDirectory();
  } catch (error) {
    console.log(chalk.red(error));
    process.exit(1);
  }

  console.log();

  const quest = currentWorkingQuest();

  if (quest.info.type == "ctf") {
    console.log(
      chalk.yellow("Quest is a CTF quest. No need to submit via Questplay.\n")
    );
    process.exit(0);
  }

  const statusSummary = await git.status();
  if (statusSummary.files.length) {
    console.log(UNCOMMITTED_FILES_MESSAGE);
    process.exit(1);
  }

  const branchSummaryResult = await git.branch();
  const currentBranch =
    branchSummaryResult.branches[branchSummaryResult.current];

  if (
    !isSetUpstream &&
    (await git.raw(
      "ls-remote",
      "--exit-code",
      "--heads",
      "origin",
      currentBranch.name
    )) == ""
  ) {
    console.log(NoUpstreamBranchMessage(currentBranch.name));
    process.exit(1);
  }

  let client;
  const spinner = createSpinner();

  try {

    if (isListening) {
      const token = await getToken(environment);
      startSpinner(spinner, "Connecting to Questplay");

      client = await getWsClient(token, environment);
      await waitTopicMessage(client, "connect");

      succeedSpinner(spinner, "Connected to Questplay");
    }

    startSpinner(spinner, "Committing files");

    await git.commit(`#${quest.info.name}`, [], ["--allow-empty"]);

    succeedSpinner(spinner, "Committed files");
    startSpinner(spinner, "Pushing files");

    await git.push(["-u", "origin", currentBranch.name]);

    succeedSpinner(spinner, "Pushed files");

    if (isListening) {
      startSpinner(spinner, "Waiting for server to start verification");

      await waitTopicEventMessage(
        client,
        "quests",
        "offChainVerificationStarted"
      );

      succeedSpinner(spinner, "Server started verification");
      startSpinner(spinner, "Waiting for results");

      const message = await waitExclusiveTopicEventsMessage(
        client,
        "quests",
        ["offChainVerificationFinished", "offChainVerificationFailed"],
        1000 * 90
      );

      succeedSpinner(spinner, "Received results");

      if (message.event == "offChainVerificationFailed") {
        console.log(SUBMISSION_FAILED_BANNER);
        console.log(chalk.red(message.data.error));
      } else {
        if (message.data.result.error) {
          console.log(SUBMISSION_ERROR_BANNER);
          console.log(chalk.red(message.data.result.error));
        } else {
          console.log(chalk.green("\nSubmission successful"));
          const report = message.data.result.testReport.sort((a, b) => {
            return a.part < b.part;
          });

          for (const part of report) {
            await printPart(part);
          }
        }
      }
    } else {
      console.log(
        chalk.green(
          `Quest ${quest.info.name} submitted, your results will be available on nodeguardians.io in a few seconds.\n`
        )
      );
    }

    stopSpinner(spinner);
  } catch (err) {
    spinner.stop();
    console.log(chalk.red(err));
    process.exit(1);
  } finally {
    if (client) {
      client.close();
    }
  }
}
