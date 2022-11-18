'use strict';

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Octokit } from '@octokit/rest';
import { mainPath } from "./navigation.js";
import { CREDENTIALS_NOT_FOUND_MESSAGE } from "./messages.js";

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
  const file = await octokit.repos.getContent({
    owner: "NodeGuardians",
    repo: "ng-questplay",
    path: "package.json"
  });

  const decodedContent = Buffer.from(file.data.content, file.data.encoding);
  const packageJson = JSON.parse(decodedContent);

  _remoteVersion = packageJson.version
  return _remoteVersion;
}
