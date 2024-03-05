import fs from 'fs';
import path from 'path';
import toml from 'toml';

import { BaseQuest } from './baseQuest.js';
import { checkScarbVersion } from '../utils/versions.js';
import { spawnSync } from 'child_process';
import { QuestDownloader } from '../utils/downloader.js';

export class CairoQuest extends BaseQuest {

    static async find(questName) {
        const qdown = new QuestDownloader();
        const campaigns = JSON.parse(await qdown.downloadFile(
            "Nodeguardians",
            "ng-cairo-quests-public",
            "campaigns/directory.json",
            {tempFile: true}));

        for (const campaign of campaigns) {
            for (const quest of campaign.quests) {
                if (quest.name != questName) continue;

                return new CairoQuest(campaign.name, quest);
            }
        }

        return null;
    }

    constructor(campaignName, questInfo) {
        super("cairo", campaignName, questInfo, runCairoTests);
    }

    localVersion() {
        // Quest not installed
        if (!fs.existsSync(this.localPath())) {
            return null;
        }

        const scarbTomlPath = path.join(this.localPath(), "Scarb.toml");
        const scarbTomlData = toml.parse(fs.readFileSync(scarbTomlPath));

        return scarbTomlData.package.version;
    }

}

async function runCairoTests(partIndex) {

    console.log();
    if (!checkScarbVersion()) process.exit(1);

    const cairoTestParams = [
        "test", "-f", `test_${partIndex}`
    ];

    spawnSync("scarb", cairoTestParams, { stdio: "inherit" });
    console.log();

}