import path from "path";

import { SolidityQuest } from "./solQuest.js";
import { CairoQuest } from "./cairoQuest.js";
import { campaignPath } from "../utils/navigation.js";

export function getQuest(questName) {
    // 1. Find in Solidity directory
    const solidityQuest = SolidityQuest.find(questName);
    if (solidityQuest != null) return solidityQuest;

    // 2. Find in Cairo directory
    const cairoQuest = CairoQuest.find(questName);
    if (cairoQuest != null) return cairoQuest;

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