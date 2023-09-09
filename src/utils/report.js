import chalk from "chalk";

/**
 * Prints a test uite report to the console
 * @param {Object} suite to print
 * @param {Number} depth of the suite in the tree
 */
export async function printSuite(suite, depth = 0) {
  const check = "\u2713";
  const cross = "\u2717";

  const indent = "    ".repeat(depth);

  console.log(`\n  ${indent}${suite.title}`);

  for (const test of suite.tests) {
    if (test.pass) {
      console.log(
        indent + "   " + chalk.green(check) + " " + chalk.grey(test.title)
      );
    } else {
      console.log(
        indent + "   " + chalk.red(cross) + " " + chalk.grey(test.title)
      );
      console.log(indent + "     " + chalk.red(test.err));
    }
  }

  for (const childSuite of suite.suites) {
    await printSuite(childSuite, depth + 1);
  }
}

/**
 * Prints a quest part report to the console
 * @param {Object} part to print
 */
export async function printPart(part) {
  const passed = part.passed ? chalk.green(`${part.passed} passed`) : "";
  const failed = part.failed ? chalk.red(`${part.failed} failed`) : "";

  console.log(chalk.yellow(`\nPart ${part.part} - ${passed} ${failed}\n`));

  for (const suite of part.suites) {
    await printSuite(suite);
  }
}
