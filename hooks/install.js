#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { mainPath } from '../src/utils/navigation.js';

const hookFile = path.join(mainPath(), "hooks", "pre-commit");
const dstPath = path.join(mainPath(), ".git", "hooks", "pre-commit");

fs.copyFileSync(hookFile, dstPath);