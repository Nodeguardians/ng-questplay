import fs from 'fs';
import path from 'path';
import { mainPath } from '../utils/navigation.js';

export class BaseQuest {

    constructor(language, campaignName, questInfo) {
        this.info = questInfo;
        this.campaignName = campaignName;
        this.language = language;
        this.fromRepository = `ng-${language}-quests-public`;
    }

    downloadPath() {
        return `campaigns/${this.campaignName}/${this.info.name}`;
    }
    
    localPath() {
        return path.join(mainPath(), this.downloadPath());
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
