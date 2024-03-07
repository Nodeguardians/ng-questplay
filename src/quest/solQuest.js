import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

import { BaseQuest } from './baseQuest.js';
import { readSettings } from '../utils/navigation.js';
import { checkForgeVersion } from '../utils/versions.js';
import { spawnSync } from 'child_process';
import { QuestDownloader } from '../utils/downloader.js';

let hre;

export class SolidityQuest extends BaseQuest {

    static async find(questName) {
        const qdown = new QuestDownloader();
        const campaigns = JSON.parse(await qdown.downloadFile(
            "Nodeguardians",
            "ng-quests-public",
            "campaigns/directory.json",
            { tempFile: true }));

        for (const campaign of campaigns) {
            for (const quest of campaign.quests) {
                if (quest.name != questName) continue;

                return new SolidityQuest(campaign.name, quest);
            }
        }

        return null;
    }

    constructor(campaignName, questInfo) {
        const runTests = (readSettings().framework == "foundry")
            ? runFoundryTests
            : runHardhatTests;

        super("solidity", campaignName, questInfo, runTests);
        // TODO: Remove this when migrating to ng-solidity-quests-public
        this.fromRepository = "ng-quests-public";
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

async function runHardhatTests(partIndex) {

    if (hre == undefined) {
        hre = await import('hardhat');
    }

    await hre.default.run("test", { grep: `Part ${partIndex}` });

}

async function runFoundryTests(partIndex) {

    console.log();
    if (!checkForgeVersion()) process.exit(1);

    const forgeParams = [
        "test",
        "--match-path",
        `*\.${partIndex}\.t\.sol`
    ];

    spawnSync("forge", forgeParams, { stdio: "inherit" });
    console.log();

}