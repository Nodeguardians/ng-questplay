import { execSync } from "child_process";
import { assertRegex } from "../utils/messages.js";
import path from "path";
import { mainPath } from "../../src/utils/navigation.js";

describe("quest help", async function() {

    it("Should flag when not in questplay", async function() {
        const expectedMessage = "`quest` must be run from the ng-quests directory\n"
            + "Try running: \"cd .*ng-questplay\"";

        try {
            execSync(`cd ${path.join(mainPath(), "..")} && quest`);
            throw "COMMAND_SHOULD_FAIL";
        } catch(error) {
            assertRegex(error.stdout.toString(), expectedMessage);
        }
    });

});