import { execSync } from "child_process";
import { assertRegex, assertHasMessage } from "../utils/messages.js";
import path from "path";
import { mainPath } from "../../src/utils/navigation.js";

describe("quest help", async function() {

    const unexpectedParamsMessage = "ERROR: Unexpected parameter(s)";

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

    it ("Should display general help", async function() {
        const helpMessage = "find           Search for a specific quest in the repo\n"
            + "test           Run local tests for the current quest\n"
            + "submit         Submit quest to nodeguardians.io for verification\n"
            + "update         Update Questplay to the latest version\n"
            + "bridge         Query the bridge signer for a signature\n"
            + "set-framework  Set default framework for local tests\n";
        const errorMessage = "ERROR: Unrecognized command";

        // --help flag
        const resultString = execSync("quest --help").toString();
        assertHasMessage(resultString, helpMessage);

        // Unrecognized parameters
        try {
            result = execSync("quest xyz").toString();
            throw "COMMAND_SHOULD_FAIL";
        } catch(error) {
            assertHasMessage(error.stdout.toString(), errorMessage);
            assertHasMessage(error.stdout.toString(), helpMessage);
        }
    });

    it ("Should display help for find", async function() {
        const helpMessage = "Usage: quest find [<name>]\n"
            + "Example: quest find using-signatures\n"
            + "Find a quest in the repository. Queries for a name if name is unspecified.\n"
            + "name:     (Optional) Name of quest to find. [hyphenated, no spacing]";

        // --help flag
        const result = execSync("quest find --help").toString();

        // Unexpected parameters
        try {
            result = execSync("quest find 1 2").toString();
            throw "COMMAND_SHOULD_FAIL";
        } catch(error) {
            assertHasMessage(error.stdout.toString(), unexpectedParamsMessage);
            assertHasMessage(error.stdout.toString(), helpMessage);
        }
    });

    it ("Should display help for test", async function() {
        const helpMessage = "Usage: quest test [<index>]\n"
            + "Example: quest test 1\n"
            + "Run a quest's local test(s). If the index is unspecified, test all parts.\n"
            + "Must be ran in a valid quest directory.\n"
            + "index:     Part of quest to test (e.g. 1, 2, 3)\n";
        
        // --help flag
        const result = execSync("quest test --help").toString();
        assertHasMessage(result.toString(), helpMessage);

        // Unexpected parameters
        try {
            result = execSync("quest test 1 2").toString();
            throw "COMMAND_SHOULD_FAIL";
        } catch(error) {
            assertHasMessage(error.stdout.toString(), unexpectedParamsMessage);
            assertHasMessage(error.stdout.toString(), helpMessage);
        }
    });

    it ("Should display help for submit", async function() {
        const helpMessage = "Usage: quest submit (--set-upstream)\n"
            + "Submit a quest to nodeguardians.io for verification\n"
            + "--set-upstream:     (Optional) Push a new branch upstream";

        // --help flag
        const result = execSync("quest submit --help").toString();
        assertHasMessage(result.toString(), helpMessage);

        // Unrecognized parameters
        try {
            result = execSync("quest submit 1 2").toString();
            throw "COMMAND_SHOULD_FAIL";
        } catch(error) {
            assertHasMessage(error.stdout.toString(), unexpectedParamsMessage);
            assertHasMessage(error.stdout.toString(), helpMessage);
        }
    });

    it ("Should display help for update", async function() {
        const helpMessage = "Usage: quest update\n"
            + "Update Questplay to the latest version.";

        // --help flag
        const result = execSync("quest update --help").toString();
        assertHasMessage(result.toString(), helpMessage);

        // Unexpected parameters
        try {
            result = execSync("quest update xyz").toString();
            throw "COMMAND_SHOULD_FAIL";
        } catch(error) {
            assertHasMessage(error.stdout.toString(), unexpectedParamsMessage);
            assertHasMessage(error.stdout.toString(), helpMessage);
        }
    });
    
    it ("Should display help for bridge", async function() {
        const helpMessage = "Usage: quest bridge <bridge-hash>\n"
            + "Query bridge signer for a signature.\n"
            + "bridge-hash:     32-byte bridge hash obtained from quest's contract";

        // --help flag
        const result = execSync("quest bridge --help").toString();
        assertHasMessage(result.toString(), helpMessage);

        // Unexpected parameters
        try {
            result = execSync("quest bridge 1 2").toString();
            throw "COMMAND_SHOULD_FAIL";
        } catch(error) {
            assertHasMessage(error.stdout.toString(), unexpectedParamsMessage);
            assertHasMessage(error.stdout.toString(), helpMessage);
        }

    });

    it ("Should display help for set-framework", async function() {
        const helpMessage = "Usage: quest set-framework [hardhat | foundry]\n"
            + "Example: quest set-framework foundry\n"
            + "Sets default framework for local tests.\n"
            + "[hardhat | foundry]: Framework of choice";
        const unrecognizedFrameworkMessage = "ERROR: Unrecognized framework";

        // --help flag
        let result = execSync("quest set-framework --help").toString();
        assertHasMessage(result.toString(), helpMessage);

        // Unrecognized framework
        try {
            result = execSync("quest set-framework xyz").toString();
            throw "COMMAND_SHOULD_FAIL";
        } catch(error) {
            assertHasMessage(error.stdout.toString(), unrecognizedFrameworkMessage);
            assertHasMessage(error.stdout.toString(), helpMessage);
        }

        // Unexpected parameters
        try {
            result = execSync("quest set-framework").toString();
            throw "COMMAND_SHOULD_FAIL";
        } catch(error) {
            assertHasMessage(error.stdout.toString(), unexpectedParamsMessage);
            assertHasMessage(error.stdout.toString(), helpMessage);
        }
    });
});