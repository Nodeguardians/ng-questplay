import fs from 'fs';
import path from 'path';

import { BaseQuest } from './baseQuest.js';
import { mainPath } from '../utils/navigation.js';

export class SolidityQuest extends BaseQuest {

    static find(questName) {
        const directoryPath = path.join(mainPath(), "campaigns/directory.json");
        const campaigns = JSON.parse(fs.readFileSync(directoryPath));

        for (const campaign of campaigns) {
            for (const quest of campaign.quests) {
              if (quest.name != questName) continue;
      
              return new SolidityQuest(campaign.name, quest);
            }
        }

        return null;
    }

    constructor(campaignName, questInfo) {
        super("solidity", campaignName, questInfo);
        // TODO: Remove this when migrating to ng-solidity-quests-public
        this.fromRepository = "ng-quests-public";
    }

}
