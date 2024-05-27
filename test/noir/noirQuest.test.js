import { assert } from 'chai';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { simpleGit } from "simple-git";

import { mainPath, readSettings } from '../../src/utils/navigation.js';
import { assertRegex, assertNoRegex } from '../utils/messages.js'
import { loadCheats } from '../utils/cheats.js';

const ENTER_KEY_CODE = 13;

describe("Noir Quests (Mocha)", function() {

    const TEST_CAMPAIGN_SLUG = "discovering-noir";
    const TEST_QUEST_SLUG = "zk-dungeon";
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
        assert(currentBranch != "temp/test-noir", "TEST_SHOULDNT_START_IN_TEST_BRANCH");

        await git.checkout(["-B", "temp/test-noir"])
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
            assert(fs.existsSync(path.join(TEST_QUEST_PATH, "package.json")));
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
        
        it("Should test single part (unsolved)", async function() {
            const part1Regex = "== Testing Part 1 =="
                + "(.|\n)*Is Valid Path \\(Part 1\\)"
                + "(.|\n)*4 failing"
                + "(.|\n)*";

            const part2Regex = "== Testing Part 2 =="
                + "(.|\n)*Is Safe Path \\(Part 2\\)";

            const stdout = execSync(`cd ${TEST_QUEST_PATH} && quest test 1`);

            assertRegex(stdout.toString(), part1Regex);
            assertNoRegex(stdout.toString(), part2Regex);
            
        });

        it("Loading cheats...", async function() {     
            const cheatsFolder = path.join(mainPath(), "test/noir/cheats/mocha");
            loadCheats(cheatsFolder, TEST_QUEST_PATH);
        });
        
        it("Should test single part (solved)", async function() {
            const part1Regex = "== Testing Part 1 =="
                + "(.|\n)*Is Valid Path \\(Part 1\\)"
                + "(.|\n)*3 passing"
                + "(.|\n)*";

            const part2Regex = "== Testing Part 2 =="
                + "(.|\n)*Is Safe Path \\(Part 2\\)"
                + "(.|\n)*";

            const resultString = execSync(`cd ${TEST_QUEST_PATH} && quest test 1`).toString();
            assertRegex(resultString, part1Regex);
            assertNoRegex(resultString, part2Regex);
        });

        it("Should test all parts (solved)", async function() {
            const allPartsRegex =  "== Testing Part 1 =="
                + "(.|\n)*Is Valid Path \\(Part 1\\)"
                + "(.|\n)*3 passing"
                + "(.|\n)*== Testing Part 2 =="
                + "(.|\n)*Is Safe Path \\(Part 2\\)"
                + "(.|\n)*3 passing"
                + "(.|\n)*== Testing Part 3 =="
                + "(.|\n)*Proof of Path \\(Part 3\\)"
                + "(.|\n)*1 passing"
                + "(.|\n)*";

            const resultString = execSync(`cd ${TEST_QUEST_PATH} && quest test`).toString();
            assertRegex(resultString, allPartsRegex);
        });

    });

    after(async function() {
        
        fs.rmSync(
            path.join(mainPath(), `campaigns/${TEST_CAMPAIGN_SLUG}`), 
            { recursive: true, force: true }
        );
        
        if (isDev) { return; }

        await git.checkout(currentBranch);
        await git.deleteLocalBranch("temp/test-noir", true);
    });

});

describe("Noir Quests (Hardhat)", function() {

    const TEST_CAMPAIGN_SLUG = "discovering-noir";
    const TEST_QUEST_SLUG = "daggers-and-decoys";
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
        assert(currentBranch != "temp/test-noir", "TEST_SHOULDNT_START_IN_TEST_BRANCH");

        await git.checkout(["-B", "temp/test-noir"])
    });
    
    // Previous `quest find` covers common test cases 
    describe("quest find", async function() {

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
            assert(fs.existsSync(path.join(TEST_QUEST_PATH, "package.json")));
        });

    });

    describe("quest test", async function() {
        
        it("Should test single part (unsolved)", async function() {
            const part2Regex = "== Testing Part 2 =="
                + "(.|\n)*Noir Circuit \\(Part 2\\)"
                + "(.|\n)*2 failing"
                + "(.|\n)*";

            const part3Regex = "== Testing Part 3 =="
                + "(.|\n)*Dagger Spell \\(Part 3\\)";

            try {
                execSync(`cd ${TEST_QUEST_PATH} && quest test 2`);
                throw "QUEST_SHOULD_FAIL";
            } catch(error) {
                assertRegex(error.stdout.toString(), part2Regex);
                assertNoRegex(error.stdout.toString(), part3Regex);
            }
        });

        it("Loading cheats...", async function() {     
            const cheatsFolder = path.join(mainPath(), "test/noir/cheats/hardhat");
            loadCheats(cheatsFolder, TEST_QUEST_PATH);
        });
        
        it("Should test single part (solved)", async function() {
            const part3Regex = "== Testing Part 3 =="
                + "(.|\n)*Dagger Spell \\(Part 3\\)"
                + "(.|\n)*1 passing"
                + "(.|\n)*";

            const part2Regex = "== Testing Part 2 =="
                + "(.|\n)*Noir Circuit \\(Part 2\\)"
                + "(.|\n)*";

            const resultString = execSync(`cd ${TEST_QUEST_PATH} && quest test 3`).toString();
            assertRegex(resultString, part3Regex);
            assertNoRegex(resultString, part2Regex);
        });

        it("Should test all parts (solved)", async function() {
            const allPartsRegex =  "== Testing Part 2 =="
                + "(.|\n)*Noir Circuit \\(Part 2\\)"
                + "(.|\n)*1 passing"
                + "(.|\n)*== Testing Part 3 =="
                + "(.|\n)*Dagger Spell \\(Part 3\\)"
                + "(.|\n)*1 passing"
                + "(.|\n)*";

            const resultString = execSync(`cd ${TEST_QUEST_PATH} && quest test`).toString();
            assertRegex(resultString, allPartsRegex);
        });

    });

    after(async function() {
        
        fs.rmSync(
            path.join(mainPath(), `campaigns/${TEST_CAMPAIGN_SLUG}`), 
            { recursive: true, force: true }
        );
        
        if (isDev) { return; }

        await git.checkout(currentBranch);
        await git.deleteLocalBranch("temp/test-noir", true);
    });

});