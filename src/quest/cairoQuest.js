import fs from 'fs';
import path from 'path';

import { BaseQuest } from './baseQuest.js';
import { mainPath } from '../utils/navigation.js';

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
        super("cairo", campaignName, questInfo);
    }

}
