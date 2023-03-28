#!/bin/bash

test_header() {
    echo "////////////////////////////////////////////////"
    echo "//"
    echo "// $1"
    echo "//"
    echo "////////////////////////////////////////////////"
}

cd "$(dirname "$0")"

touch temp_out.txt
TEST_DIRECTORY="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
TEMP_OUTPUT="${TEST_DIRECTORY}temp_out.txt"
TEMP_COMPARE="${TEST_DIRECTORY}temp_cmp.txt"

OS=${1:-""} 

# Test `quest`

test_header "Calling \`quest\` only should print banner + help" >> "${TEMP_OUTPUT}"
quest >> "${TEMP_OUTPUT}"

test_header "Calling \`quest --help\` should print help" >> "${TEMP_OUTPUT}"
quest --help >> "${TEMP_OUTPUT}"

# TODO: Test that `quest` outputs correct message when called outside package

# Test `quest test`

cp -r test-campaign ../campaigns/
cd ../campaigns/test-campaign

test_header "Calling \`test\` outside a quest should print error message" >> "${TEMP_OUTPUT}"
quest test 1 >> "${TEMP_OUTPUT}"

test_header "Calling \`test\` with an invalid integer should print error message" >> "${TEMP_OUTPUT}"
quest test abc >> "${TEMP_OUTPUT}"

test_header "Calling \`test\` inside a quest should work (Hardhat)" >> "${TEMP_OUTPUT}"
cd ./test-build-quest
quest test --hardhat >> "${TEMP_OUTPUT}"
quest test 1 >> "${TEMP_OUTPUT}"

test_header "Calling \`test\` without an integer should run all tests (Hardhat)" >> "${TEMP_OUTPUT}"
quest test >> "${TEMP_OUTPUT}"

test_header "Calling \`test\` inside a subfolder in the quest folder should work (Hardhat)" >> "${TEMP_OUTPUT}"
cd contracts
quest test 2 >> "${TEMP_OUTPUT}"

cd .. # Go back to quest directory

test_header "Calling \`test\` inside a quest should work (Foundry)" >> "${TEMP_OUTPUT}"
quest test --hardhat >> "${TEMP_OUTPUT}"
quest test 2 >> "${TEMP_OUTPUT}"

test_header "Calling \`test\` without an integer should run all tests" >> "${TEMP_OUTPUT}"
quest test >> "${TEMP_OUTPUT}"

test_header "Calling \`test\` inside a subfolder in the quest folder should work (Foundry)" >> "${TEMP_OUTPUT}"
cd contracts
quest test 2 >> "${TEMP_OUTPUT}"

cd ../.. # Go back to test-campaign directory

test_header "Calling \`test\` in a CTF quest should print error message" >> "${TEMP_OUTPUT}"
cd test-ctf-quest
quest test >> "${TEMP_OUTPUT}"

# TODO: `quest find`
# Find test-campaign for invalid quest

# Test output difference (exclude timing differences and compiler downloads)

if [[ $OS = 'windows-latest' ]]; then
    fc "${TEMP_OUTPUT}" "${TEST_DIRECTORY}expected_out.txt" \
        | grep -wv -e "Downloading compiler" -e "---" -e "[0-9]\{2,3\}[c,d][0-9]\{2,3\}" \
        | grep -wv -e "passing (.*s)" -e "finished in .*ms" \
        >> "${TEMP_COMPARE}"
else
    diff "${TEMP_OUTPUT}" "${TEST_DIRECTORY}expected_out.txt" \
        | grep -wv -e "Downloading compiler" -e "---" -e "[0-9]\{2,3\}[c,d][0-9]\{2,3\}" \
        | grep -wv -e "passing (.*s)" -e "finished in .*ms" \
        >> "${TEMP_COMPARE}"
fi

cat "${TEMP_COMPARE}"
num_error=`wc -l < "${TEMP_COMPARE}" | xargs`

# Remove temporary folders / files
rm "${TEMP_OUTPUT}"
rm "${TEMP_COMPARE}"
rm -rf "${TEST_DIRECTORY}../campaigns/test-campaign"

cd "${TEST_DIRECTORY}.."

if [ $num_error != 0 ]; then
    exit 1
fi