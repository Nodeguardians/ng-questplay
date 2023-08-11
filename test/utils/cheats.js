import fs from 'fs';
import path from 'path';

export function loadCheats(cheatsFolder, destinationFolder) {
    for (const cheatFilePath of walkDir(cheatsFolder)) {
        const destPath = path.join(
            destinationFolder,
            path.relative(cheatsFolder, cheatFilePath)
        );

        fs.copyFileSync(cheatFilePath, destPath);
    }
}

function* walkDir(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
  
    for (const file of files) {
      if (file.isDirectory()) {
        yield* walkDir(path.join(dir, file.name));
      } else {
        yield path.join(dir, file.name);
      }
    }
  }