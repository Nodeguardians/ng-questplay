import path from "path";

import { SolidityQuest } from "./solQuest.js";
import { CairoQuest } from "./cairoQuest.js";
import { NoirQuest } from "./noirQuest.js";
import { campaignPath } from "../utils/navigation.js";
import { HuffQuest } from "./huffQuest.js";

export async function getQuest(questName) {
    // 1. Find in Solidity directory
    const solidityQuest = await SolidityQuest.find(questName);
    if (solidityQuest != null) return solidityQuest;

    // 2. Find in Cairo directory
    const cairoQuest = await CairoQuest.find(questName);
    if (cairoQuest != null) return cairoQuest;

    // 3. Find in Noir directory
    const noirQuest = await NoirQuest.find(questName);
    if (noirQuest != null) return noirQuest;
    
    // 3. Find in Huff directory
    const huffQuest = await HuffQuest.find(questName);
    if (huffQuest != null) return huffQuest;

    return null;
}

export function currentWorkingQuest() {

    if (path.resolve(process.cwd(), "../..") != campaignPath()) {
        throw "Error: NOT_IN_QUEST_DIRECTORY"
    }

    // TODO: Infer from campaigns folder when implemented
    const questName = path.basename(process.cwd());
    return getQuest(questName);
}