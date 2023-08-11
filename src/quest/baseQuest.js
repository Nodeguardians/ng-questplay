import chalk from 'chalk';
import path from 'path';
import { mainPath } from '../utils/navigation.js';

export class BaseQuest {

    constructor(language, campaignName, questInfo, runTests) {
        this.info = questInfo;
        this.campaignName = campaignName;
        this.language = language;
        this.fromRepository = `ng-${language}-quests-public`;

        this.runTests = runTests;
    }

    downloadPath() {
        return `campaigns/${this.campaignName}/${this.info.name}`;
    }
    
    localPath() {
        return path.join(mainPath(), this.downloadPath());
    }

    async test(partIndex = undefined) {

        if (this.info.type == "ctf") {
            console.log(chalk.yellow("\nQuest is a CTF quest. No local tests to run.\n"));
            return;
        }
        
        if (partIndex > this.info.parts) {
            console.log(chalk.yellow(`\nPart ${partIndex} does not exist in this quest.\n`));
            return;
        }

        if (partIndex != undefined) {
            console.log(chalk.bold(`\n== Testing Part ${partIndex} ==`));
            await this.runTests(partIndex);
            return;
        }

        console.log();
        for (let i = 1; i <= this.info.parts; i++) {
            console.log(chalk.bold(`== Testing Part ${i} ==`));
            await this.runTests(i);
        }

    }

}
