'use strict';
import commandExists from 'command-exists';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import toml from 'toml';
import { Octokit } from '@octokit/rest';
import { spawnSync } from 'child_process';
import { mainPath, readSettings } from "./navigation.js";
import { 
  CREDENTIALS_NOT_FOUND_MESSAGE ,
  INSTALL_FOUNDRY_MESSAGE,
  INSTALL_FORGE_LIB_MESSAGE,
  UPDATE_FOUNDRY_MESSAGE,
  UPDATE_FORGE_LIB_MESSAGE,
  FORGE_VERSION_FAIL
} from "./messages.js";

let _remoteVersion;

export async function localVersion() {
  const packageFile = fs.readFileSync(path.join(mainPath(), './package.json'));
  return JSON.parse(packageFile).version;
}

export async function remoteVersion()  {
  return (_remoteVersion != undefined)
    ? _remoteVersion
    : await pullRemoteVersion();
}

export async function isLatestVersion() {
  return (await localVersion()) == (await remoteVersion());
}

async function pullRemoteVersion() {

  dotenv.config({ path: path.join(mainPath(), '.env') });
  const token = process.env.GITHUB_TOKEN;
  if (token == undefined) {
    console.log(CREDENTIALS_NOT_FOUND_MESSAGE);
    process.exit(1);
  }

  const octokit = new Octokit({ auth: token });
  const options = {
    owner: "NodeGuardians",
    repo: "ng-questplay",
    path: "package.json"
  }
  
  const remoteBranch = readSettings().remote;
  if(remoteBranch != undefined) {
    options.ref = remoteBranch;
  }

  const file = await octokit.repos.getContent(options);

  const decodedContent = Buffer.from(file.data.content, file.data.encoding);
  const packageJson = JSON.parse(decodedContent);

  _remoteVersion = packageJson.version
  return _remoteVersion;
}

export function remoteForgeVersion() {
  const packageFile = fs.readFileSync(path.join(mainPath(), './package.json'));
  return JSON.parse(packageFile).foundryDependencies;
}

export function localForgeVersion() {
  let versions = { 
    forge: "",
    forgeStd: ""
  };
  
  if (commandExists.sync("forge")) {
    const versionPattern = /(?<= )[0-9]+\.[0-9]+\.[0-9]+(?= )/;
    const match = spawnSync("forge", ["--version"]).stdout
      .toString().match(versionPattern);

    versions.forge = (match == null) ? "error" : match[0];
  }

  const forgeLibPath = path.join(mainPath(), "lib", "forge-std", "package.json");
  if (fs.existsSync(forgeLibPath)) {
    const packageFile = fs.readFileSync(forgeLibPath);
    versions.forgeStd = JSON.parse(packageFile).version;
  }

  return versions;
}

export function checkForgeVersion() {
  const remote = remoteForgeVersion();
  const local = localForgeVersion();

  let isInstalled = true;
  if (local.forge == "") {
    console.log(INSTALL_FOUNDRY_MESSAGE);
    isInstalled = false;
  }

  if (local.forgeStd == "") {
    console.log(INSTALL_FORGE_LIB_MESSAGE());
    isInstalled = false;
  }

  if (!isInstalled) return isInstalled;

  if (local.forge == "error") {
    console.log(FORGE_VERSION_FAIL);
  } else if (compareVersionString(remote.forge, local.forge) > 0) {
    console.log(UPDATE_FOUNDRY_MESSAGE);
  }

  if (compareVersionString(remote.forgeStd, local.forgeStd) > 0) {
    console.log(UPDATE_FORGE_LIB_MESSAGE);
  }

  return isInstalled;

}

// TODO: Refactor this to be multi-protocol friendly
export function localQuestVersion(questPath) {
  if (!fs.existsSync(questPath)) {
    // Quest not installed
    return null
  }

  const packageJsonPath = path.join(questPath, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    return JSON.parse(fs.readFileSync(packageJsonPath)).version;
  }

  const scarbTomlPath = path.join(questPath, "Scarb.toml");
  return toml.parse(fs.readFileSync(scarbTomlPath)).package.version;
}

function compareVersionString(v1, v2) {
  return v1.localeCompare(v2, undefined, { numeric: true, sensitivity: 'base' })
}