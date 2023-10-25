import fs from 'fs';
import path from 'path';

import { BaseQuest } from './baseQuest.js';
import { mainPath } from '../utils/navigation.js';
import { checkNargoVersion } from '../utils/versions.js';
import { execSync } from 'child_process';

let hre;

const MOCHA_TIMEOUT = 10000

export class NoirQuest extends BaseQuest {

    static find(questName) {
        const directoryPath = path.join(mainPath(), "campaigns/noir-directory.json");
        const campaigns = JSON.parse(fs.readFileSync(directoryPath));

        for (const campaign of campaigns) {
            for (const quest of campaign.quests) {
              if (quest.name != questName) continue;

              return new NoirQuest(campaign.name, quest);
            }
        }

        return null;
    }

    constructor(campaignName, questInfo) {
        super("noir", campaignName, questInfo, runJSTests);
        // TODO: Remove this when migrating to ng-noir-quests-public
        this.fromRepository = "ng-noir-quests-public";
    }

    localVersion() {
        // Quest not installed
        if (!fs.existsSync(this.localPath())) {
            return null;
        }

        const packageDataPath = path.join(this.localPath(), "package.json");
        const packageData = JSON.parse(
            fs.readFileSync(packageDataPath)
        );

        return packageData.version;
    }

}

/**
 * Runs Mocha tests if there is no hardhat.config.js 
 * Else, runs hardhat tests
 */
async function runJSTests(partIndex) {

    if (!checkNargoVersion()) process.exit(1);
    const hardhatConfigFile = path.join(this.localPath(), "hardhat.config.js");

    if (fs.existsSync(hardhatConfigFile)) {

        if (hre == undefined) {
            hre = await import('hardhat');
        }
        await hre.default.run("test", { grep: `Part ${partIndex}` });

    } else {

        const mochaCommand 
            = `npx mocha test --timeout ${MOCHA_TIMEOUT} --recursive --grep "(Part ${partIndex})"`;
        try {
            execSync(mochaCommand, {stdio: 'inherit'});
        } catch (error) { }

    }

}

