import { assert } from 'chai';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { simpleGit } from "simple-git";

import { mainPath, readSettings } from '../../src/utils/navigation.js';
import { assertRegex, assertNoRegex } from '../utils/messages.js'
import { loadCheats } from '../utils/cheats.js';

const ENTER_KEY_CODE = 13;

describe("Cairo Quests", function() {

    const TEST_CAMPAIGN_SLUG = "cairo-thinking";
    const TEST_QUEST_SLUG = "racing-riverboats";
    const TEST_QUEST_PATH = path.join(
        mainPath(), "campaigns", TEST_CAMPAIGN_SLUG, TEST_QUEST_SLUG);

    let currentBranch;
    let git;
    let isDev;

    before(async function() {
        git = simpleGit();
        isDev = readSettings().devMode;

        if (isDev) { return; }

        // Tests might modify git history
        // So, create a temp branch to run tests in
        const gitStatus = await git.status();
        
        let hasUncommitted = gitStatus.staged.length != 0 
            || gitStatus.not_added.length != 0 
            || gitStatus.modified.length != 0;
        assert(!hasUncommitted, "TEST_SHOULDNT_START_W_UNCOMMITTED_CHANGES");

        currentBranch = gitStatus.current;
        assert(currentBranch != "temp/test-cairo", "TEST_SHOULDNT_START_IN_TEST_BRANCH");

        await git.checkout(["-B", "temp/test-cairo"])
    });
    
    describe("quest find", async function() {

        // TODO: Test cancelling a download
        it("Should download new quest when prompted", async function() {
            assert(!fs.existsSync(TEST_QUEST_PATH), "Quest already exists");

            const inputArray = new Uint8Array([ENTER_KEY_CODE]);
            try {
                execSync(`quest find ${TEST_QUEST_SLUG}`, { input: inputArray });
            } catch (error) {
                console.log(error.stdout.toString());
                throw error;
            }

            assert(fs.existsSync(TEST_QUEST_PATH));
            assert(fs.existsSync(path.join(TEST_QUEST_PATH, "Scarb.toml")));
        });

        it("Should handle existing quest", async function() {
            const outputString = execSync(`quest find ${TEST_QUEST_SLUG}`).toString();
            const regexString = `${TEST_QUEST_SLUG} \\([0-9]+\\.[0-9]+\\.[0-9]+\\) found in ${TEST_CAMPAIGN_SLUG}\n`
                + "Latest version of quest already exists in local repo\\.\n"
                + `To navigate to quest directory, run cd campaigns.${TEST_CAMPAIGN_SLUG}.${TEST_QUEST_SLUG}` 
            assertRegex(outputString, regexString);
        });

        it("Should install and commit quest", async function() {
            // Skip this test in dev mode
            if (isDev) { return; }

            const gitStatus = await git.status();
            let hasUncommitted = gitStatus.staged.length != 0 
                || gitStatus.not_added.length != 0 
                || gitStatus.modified.length != 0;

            assert(!hasUncommitted, "New quest should be committed");
            const latestCommit = (await git.log({ maxCount: 1 })).latest;
            assert(latestCommit.message == `Download quest ${TEST_QUEST_SLUG}`);
        });

    });

    describe("quest test", async function() {
            
        it("Should scarb test single part (unsolved)", async function() {
            const part1Regex = "== Testing Part 1 =="
                + "(.|\n)test src::tests::find_crocodiles_test_1"
                + "(.|\n)*";

            const part2Regex = "== Testing Part 2 =="
                + "(.|\n)*running 5 tests"
                + "(.|\n)*test src::tests::sail_river_test_2::test_sail_river ... fail"
                + "(.|\n)*";

            const result = execSync(
                `cd ${TEST_QUEST_PATH} && quest test 2`, 
                { stdio: [ "pipe", "pipe", "ignore" ] }
            );
            assertNoRegex(result.toString(), part1Regex);
            assertRegex(result.toString(), part2Regex);
        });
    
        it("Loading solutions...", async function() {
            const cheatsFolder = path.join(mainPath(), "test/cairo/cheats");
            loadCheats(cheatsFolder, TEST_QUEST_PATH);
        });
        
        it("Should scarb test single part (solved)", async function() {
            const part1Regex = "== Testing Part 1 =="
                + "(.|\n)test src::tests::find_crocodiles_test_1::test_find_crocodiles ... ok"
                + "(.|\n)*";

            const part2Regex = "== Testing Part 2 =="
                + "(.|\n)*running 5 tests"
                + "(.|\n)*test src::tests::sail_river_test_2::test_sail_river ... ok"
                + "(.|\n)*";

            const result = execSync(`cd ${TEST_QUEST_PATH} && quest test 2`);
            assertNoRegex(result.toString(), part1Regex);
            assertRegex(result.toString(), part2Regex);
        });

        it("Should scarb test all parts (solved)", async function() {
            const allPartsRegex =  "== Testing Part 1 =="
                + "(.|\n)*test src::tests::find_crocodiles_test_1::test_find_crocodiles ... ok"
                + "(.|\n)*== Testing Part 2 =="
                + "(.|\n)*test src::tests::sail_river_test_2::test_sail_river ... ok"
                + "(.|\n)*";

            const result = execSync(`cd ${TEST_QUEST_PATH} && quest test`);
            assertRegex(result.toString(), allPartsRegex);
        });

    });

    after(async function() {
        fs.rmSync(
            path.join(mainPath(), `campaigns/${TEST_CAMPAIGN_SLUG}`), 
            { recursive: true, force: true }
        );

        if (isDev) { return; }

        await git.checkout(currentBranch);
        await git.deleteLocalBranch("temp/test-cairo", true);
    });

});