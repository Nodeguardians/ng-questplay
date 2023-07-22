import { SolidityQuest } from "./solidityQuest.js";
import { CairoQuest } from "./cairoQuest.js";

export function findAll(questName) {
    // 1. Find in Solidity directory
    const solidityQuest = SolidityQuest.find(questName);
    if (solidityQuest != null) return solidityQuest;

    // 2. Find in Cairo directory
    const cairoQuest = CairoQuest.find(questName);
    if (cairoQuest != null) return cairoQuest;

    return null;
}