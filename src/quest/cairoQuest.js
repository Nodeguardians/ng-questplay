import fs from 'fs';
import path from 'path';
import toml from 'toml';

import { BaseQuest } from './baseQuest.js';
import { mainPath } from '../utils/navigation.js';
import { spawnSync } from 'child_process';

export class CairoQuest extends BaseQuest {

    static find(questName) {
        const directoryPath = path.join(mainPath(), "campaigns/cairo-directory.json");
        const campaigns = JSON.parse(fs.readFileSync(directoryPath));

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

    const cairoTestParams = [
        "test", "-f", `test_${partIndex}`
    ];

    console.log();
    spawnSync("scarb", cairoTestParams, {stdio: "inherit"});
    console.log();
    
}