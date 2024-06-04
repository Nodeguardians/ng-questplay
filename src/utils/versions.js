'use strict';
import commandExists from 'command-exists';
import fs from 'fs';
import path from 'path';
import toml from 'toml';
import semver from 'semver';
import { Octokit } from '@octokit/rest';
import { spawnSync } from 'child_process';
import { mainPath, readSettings } from "./navigation.js";
import {
  INSTALL_FOUNDRY_MESSAGE,
  INSTALL_HUFFC_MESSAGE,
  INSTALL_NARGO_MESSAGE,
  INSTALL_SCARB_MESSAGE,
  INSTALL_FORGE_LIB_MESSAGE,
  UPDATE_FOUNDRY_MESSAGE,
  UPDATE_FORGE_LIB_MESSAGE,
  UPDATE_CAIRO_MESSAGE,
  MISMATCH_HUFFC_MESSAGE,
  MISMATCH_NARGO_MESSAGE,
  MISMATCH_SCARB_MESSAGE,
  MISMATCH_NODE_MESSAGE,
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

  const octokit = new Octokit();
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
  const { forge, forgeStd } = JSON.parse(packageFile).externalDependencies;
  return { forge, forgeStd };
}

export function localForgeVersion() {
  let versions = { 
    forge: "",
    forgeStd: ""
  };
  
  if (commandExists.sync("forge")) {
    const versionPattern = /(?<= )[0-9]+\.[0-9]+\.[0-9]+/;
    const match = spawnSync("forge", ["--version"]).stdout
      .toString().match(versionPattern);

    versions.forge = match[0];
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

  if (local.forge == "") {
    console.log(INSTALL_FOUNDRY_MESSAGE);
    return false;
  }

  if (local.forgeStd == "") {
    console.log(INSTALL_FORGE_LIB_MESSAGE());
    return false;
  }

  if (local.forge == "error") {
    console.log(FORGE_VERSION_FAIL);
    return true;
  }
  
  if (!semver.satisfies(local.forge, remote.forge)) {
    console.log(UPDATE_FOUNDRY_MESSAGE);
    return false;
  }

  if (!semver.satisfies(local.forgeStd, remote.forgeStd)) {
    console.log(UPDATE_FORGE_LIB_MESSAGE);
    return false;
  }

  return true;

}
  
export function remoteScarbVersion() {
    const packageFile = fs.readFileSync(path.join(mainPath(), './package.json'));
    const { scarb, cairo } = JSON.parse(packageFile).externalDependencies;
    return { scarb, cairo };
}

export function localScarbVersion() {  
  let versions = { 
    scarb: "",
    cairo: ""
  };

  if (!commandExists.sync("scarb")) {
    return ""
  };

  const versionPattern = /(?<=scarb )[0-9]+\.[0-9]+\.[0-9]+/;
  const match = spawnSync("scarb", ["--version"]).stdout
    .toString().match(versionPattern);

  versions.scarb = match[0];

  const scarbTomlData = toml.parse(
    fs.readFileSync(path.join(process.cwd(), "./Scarb.toml"))
  );
  
  versions.cairo = scarbTomlData.package["cairo-version"];

  return versions;
}

export function checkScarbVersion() {
  const localVersion = localScarbVersion(); 
  const remoteVersion = remoteScarbVersion();
  
  if (localVersion == "") {
    console.log(INSTALL_SCARB_MESSAGE(remoteVersion.scarb));
    return false;
  };

  if (!semver.satisfies(localVersion.scarb, remoteVersion.scarb)) {
    console.log(MISMATCH_SCARB_MESSAGE(remoteVersion.scarb));
    return false;
  }

  if (!semver.satisfies(localVersion.cairo, remoteVersion.cairo)) {
    console.log(UPDATE_CAIRO_MESSAGE(localVersion.cairo, remoteVersion.cairo));
    return false;
  }

  return true;
}


export function remoteNargoVersion() {
    const packageFile = fs.readFileSync(path.join(mainPath(), './package.json'));
    const { nargo } = JSON.parse(packageFile).externalDependencies;
    return { nargo };
}

export function localNargoVersion() {  
  if (!commandExists.sync("nargo")) {
    return ""
  };

  const versionPattern = /(?<=nargo version = )[0-9]+\.[0-9]+\.[0-9]+/;

  const match = spawnSync("nargo", ["--version"]).stdout
    .toString().match(versionPattern);

  const nargo = match[0];

  return { nargo };
}

export function checkNargoVersion() {
  const localVersion = localNargoVersion(); 
  const remoteVersion = remoteNargoVersion();
  
  if (localVersion == "") {
    console.log(INSTALL_NARGO_MESSAGE(remoteVersion.nargo));
    return false;
  };

  if (!semver.satisfies(localVersion.nargo, remoteVersion.nargo)) {
    console.log(MISMATCH_NARGO_MESSAGE(remoteVersion.nargo));
    return false;
  }

  return true;
}

export function remoteHuffCVersion() {
  const packageFile = fs.readFileSync(path.join(mainPath(), './package.json'));
  const { huffc } = JSON.parse(packageFile).externalDependencies;
  return { huffc };
}

export function localHuffCVersion() {  
  if (!commandExists.sync("huffc")) {
    return ""
  };

  const versionPattern = /(?<=huffc )[0-9]+\.[0-9]+\.[0-9]+/;

  const match = spawnSync("huffc", ["--version"]).stdout
    .toString().match(versionPattern);

  const huffc = match[0];

  return { huffc };
}

export function checkHuffCVersion() {
  const localVersion = localHuffCVersion(); 
  const remoteVersion = remoteHuffCVersion();

  if (localVersion == "") {
    console.log(INSTALL_HUFFC_MESSAGE(remoteVersion.huffc));
    return false;
  };

  if (!semver.satisfies(localVersion.huffc, remoteVersion.huffc)) {
    console.log(MISMATCH_HUFFC_MESSAGE(remoteVersion.huffc));
    return false;
  }

  return true;
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

export function checkNodeVersion() {
    
  const packageFile = fs.readFileSync(path.join(mainPath(), './package.json'));
  const { node: remoteVersion } = JSON.parse(packageFile).externalDependencies;

  const localVersion = process.versions.node;
  if (!semver.satisfies(localVersion, remoteVersion)) {
    console.log(MISMATCH_NODE_MESSAGE(remoteVersion));
  }
  
}
