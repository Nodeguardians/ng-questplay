import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DIRECTORIES = {
  "cairo": "campaigns/cairo-directory.json",
  "solidity": "campaigns/directory.json"
}

export const mainPath = function() {
  return path.resolve(fileURLToPath(import.meta.url), "../../..");
};

export const campaignPath = function() {
  return path.resolve(fileURLToPath(import.meta.url), "../../../campaigns");
}

export const navigateToQuestDirectory = function() {

  if (!path.resolve(process.cwd(), "../..").startsWith(campaignPath())) {
    throw "\nERROR: Not in a quest directory\nTry `cd` to a valid quest directory first.\n"
  }

  while (path.resolve(process.cwd(), "../..") != campaignPath()) {
    process.chdir("..");
  }

}

export const navigateToMainDirectory = function() {
  process.chdir(mainPath());
}

// TODO: Refactor this to be multi-protocol friendly
export const findQuestMetadata = function(questName) {

  for (const lang of Object.keys(DIRECTORIES)) {
    const dirPath = path.join(mainPath(), DIRECTORIES[lang]);
    const campaigns = JSON.parse(fs.readFileSync(dirPath));

    for (const campaign of campaigns) {
      for (const quest of campaign.quests) {
        if (quest.name != questName) continue;

        return {
          lang: lang,
          campaign: campaign.name,
          ...quest
        }

      }
    }
  }

  return null;
}

export const getDirectory = function() {
  const directoryPath = path.join(mainPath(), './campaigns/directory.json');
  return JSON.parse(fs.readFileSync(directoryPath));
}

export const readSettings = function() {
  const settingsPath = path.join(mainPath(), '.settings/prefs.json');

  if (!fs.existsSync(settingsPath)) { 
    fs.mkdirSync(path.join(mainPath(), '.settings'));
    fs.writeFileSync(path.join(mainPath(), '.settings/prefs.json'), "{}");
    return {}; 
  }

  return JSON.parse(fs.readFileSync(settingsPath));
}

export const writeSettings = function(settingsJson) {
  const settingsPath = path.join(mainPath(), '.settings/prefs.json');
  fs.writeFileSync(settingsPath, JSON.stringify(settingsJson, null, 2));
}