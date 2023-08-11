import { assertHasMessage } from "../utils/messages.js";
import { execSync } from "child_process";

describe("quest find", async function() {

    it("Should flag inexistent quest", async function() {
        const errorMessage = "Quest not found. Did you enter the correct name?\n"
            + "Check the name again or run `quest update` to fetch the latest directory of released quests.";

        try {
            execSync(`quest find inexistent-quest`);
            throw "COMMAND_SHOULD_FAIL";
        } catch (error) {
            assertHasMessage(error.stdout.toString(), errorMessage);
        }
        
    });

});