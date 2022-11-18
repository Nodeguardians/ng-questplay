import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

export const getDirectory = function() {
  const directoryPath = path.join(mainPath(), './campaigns/directory.json');
  return JSON.parse(fs.readFileSync(directoryPath));
}
