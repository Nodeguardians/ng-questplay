import chalk from 'chalk';

const CHECKMARK = chalk.green("\u2714");
const X = chalk.red("\u2718")

function indent(i) {
  return "  ".repeat(i);
}

const sleep = (ms) => {
  return new Promise((resolve, _) => setTimeout(resolve, ms));
};

function suiteCmp(suite1, suite2) {
  const index1 = suite1.match(/(?<=Part )[1-9]+/)[0];
  const index2 = suite2.match(/(?<=Part )[1-9]+/)[0];

  return index1.localeCompare(index2);
}

export default class FoundryReport {

  constructor(jsonResults) {
    this.passCount = 0;
    this.failCount = 0;
    this.results = {};
    this.failLogs = [];
    for (const suiteName in jsonResults) {

      const [suiteTitle, subsuiteName] = this.#parseSuiteName(suiteName)
    
      if (!(suiteTitle in this.results)) { 
        this.results[suiteTitle] = [];
      }
  
      const testResults = Object.entries(
        jsonResults[suiteName].test_results
      ).map(([name, details]) => this.#parseTestResults(name, details));

      this.results[suiteTitle].push({
        name: subsuiteName, 
        testResults: testResults
      });
  
    }
  }

  async print(delay=0) {

    // Suites sorted by part
    const suitesByPart = Object.keys(this.results).sort(suiteCmp);

    for (const suiteName of suitesByPart) {
      console.log('\n' + indent(1) + suiteName);
      for (const subsuite of this.results[suiteName]) {
        console.log(indent(2) + subsuite.name);
        for (const result of subsuite.testResults) {
          await sleep(delay);
          console.log(indent(3) + result);
        }
      }
    }
  
    console.log();
    console.log(chalk.green(`${indent(1)}${this.passCount} passing`));
    if (this.failCount > 0) {
      console.log(chalk.red(`${indent(1)}${this.failCount} failing`));
    }
    console.log();

  }

  // "test/{PartName}.{PartIndex}.t.sol:{TestContractName}"
  // "test/private/{PartName}.{PartIndex}.t.sol:{TestContractName}"
  #parseSuiteName(foundrySuiteTitle) {
    const suiteTitleArr = foundrySuiteTitle.split(/[\/.:]/);

    let suiteTitle;
    if (suiteTitleArr[1] == "private") {
      const suiteName = suiteTitleArr[2].replace(/([A-Z])/g, " $1");
      const partIndex = suiteTitleArr[3];
      suiteTitle = `${suiteName.slice(1)} (Part ${partIndex}: Private)`
    } else {
      const suiteName = suiteTitleArr[1].replace(/([A-Z])/g, " $1");
      const partIndex = suiteTitleArr[2];
      suiteTitle = `${suiteName.slice(1)} (Part ${partIndex})`;
    }

    const subsuiteName = suiteTitleArr.pop().replace(/([A-Z1-9])/g, " $1");

    return [suiteTitle, subsuiteName];
  }

  #parseTestResults(testName, testDetails) {
    testName = testName.replace(/_/g, ' ').slice(0, -2);
    testName = testName[0].toUpperCase() + testName.slice(1);
    
    if (testDetails.success) {
      this.passCount++;
      return `${CHECKMARK} ${chalk.grey(testName)}`;
    } else {
      this.failCount++;
      return chalk.red(`${X} ${testName} <--- ${testDetails.decoded_logs[0]}`);
    }
  }

}