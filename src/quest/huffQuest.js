import fs from 'fs';
import path from 'path';

import { BaseQuest } from './baseQuest.js';
import { mainPath } from '../utils/navigation.js';
import { checkForgeVersion, checkHuffCVersion } from '../utils/versions.js';
import { spawnSync } from 'child_process';

export class HuffQuest extends BaseQuest {

  static find(questName) {
    const directoryPath = path.join(mainPath(), "campaigns/huff-directory.json");
    const campaigns = JSON.parse(fs.readFileSync(directoryPath));

    for (const campaign of campaigns) {
      for (const quest of campaign.quests) {
        if (quest.name != questName) continue;
  
        return new HuffQuest(campaign.name, quest);
      }
    }

    return null;
  }

  constructor(campaignName, questInfo) {
    super("huff", campaignName, questInfo, runFoundryTests);
    this.fromRepository = "ng-huff-quests-public";
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
  
async function runFoundryTests(partIndex) {
  
  console.log();
  if (!checkForgeVersion()) process.exit(1);
  if (!checkHuffCVersion()) process.exit(1);

  const forgeParams = [
    "test",
    "--match-path",
    `*\.${partIndex}\.t\.sol`
  ];

  spawnSync("forge", forgeParams, {stdio: "inherit"});
  console.log();
  
}