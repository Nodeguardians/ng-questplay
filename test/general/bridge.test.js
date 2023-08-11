import { execSync } from "child_process";
import { assertHasMessage } from "../utils/messages.js";

describe("quest bridge", async function() {

    const VALID_BRIDGE_HASH = "0xf0bc2a1dbd525ba05d22e44bed092e6a4830f42a137dbf27354a18c5bb7cf399";
    const INVALID_BRIDGE_HASH = "0x9cdf9426387be1348b538b1eea071074e6af87c68341193fa82b993a6d2ca515";

    const EXPECTED_SIGNATURE = "0xbc045d35a8b1d3757b64a797b16a25b4f934c9254db92b743bbb8d2f820d4f910165ff844779329950d0d9820317003be7d2a7cc348df5928f5136f3aff24e691b";

    it("Should sign valid bridge hash", async function() {
        const result = execSync(`quest bridge ${VALID_BRIDGE_HASH}`);

        assertHasMessage(result.toString(), "Signing hash...");
        assertHasMessage(result.toString(), "[■■■■■■■■■■■■■■■■■■■■■■■■■■■■]  Signed.");
        assertHasMessage(result.toString(), `Signature: ${EXPECTED_SIGNATURE}\n`);
    });

    it("Should flag invalid bridge hash", async function() {
        const result = execSync(`quest bridge ${INVALID_BRIDGE_HASH}`);

        assertHasMessage(result.toString(), "Signing hash...");
        assertHasMessage(result.toString(), "[■■■■■■■■■■■■■■■■■■■■■       ] Sign failed.");
        assertHasMessage(result.toString(), `Invalid bridge hash! Ensure that your bridge hash is from Avalanche Fuji.`);
    });

});