import { assert } from 'chai';

export function assertRegex(actual, regexString) {
    const regex = new RegExp(regexString);
    const actualTrimmed = actual.replaceAll(/\s*\n\s*/g, "\n");

    assert(regex.test(actualTrimmed), "Unexpected output message");
}

export function assertNoRegex(actual, regexString) {
    const regex = new RegExp(regexString);
    const actualTrimmed = actual.replaceAll(/\s*\n\s*/g, "\n");

    assert(!regex.test(actualTrimmed), "Unexpected output message");
}

export function assertHasMessage(actual, expected) {
    const actualTrimmed = actual.replaceAll(/\s*\n\s*/g, "\n");
    assert(actualTrimmed.includes(expected), "Unexpected output message");
}