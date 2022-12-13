#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { mainPath } from '../src/utils/navigation.js';

const hookFile = path.join(mainPath(), "hooks", "precommit.js");
const dstPath = path.join(mainPath(), ".git", "hooks", "pre-commit");

fs.symlinkSync(hookFile, dstPath);