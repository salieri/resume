import fs from 'node:fs/promises';
import path from 'node:path';

import type { PackageJson } from 'type-fest';

const exists = async (filePath: string, type: 'any' | 'file' | 'dir' = 'any'): Promise<boolean> => {
  try {
    const stat = await fs.stat(filePath);

    if (type === 'file') {
      return stat.isFile();
    }

    if (type === 'dir') {
      return stat.isDirectory();
    }

    return true;
  } catch {
    return false;
  }
};

export const findWorkspaceRoot = async (): Promise<string> => {
  let dir = process.cwd();

  while (true) {
    const packageJsonFile = path.join(dir, 'package.json');
    const gitPath = path.join(dir, '.git');

    if (await exists(gitPath, 'dir')) {
      return dir;
    }

    if (await exists(packageJsonFile, 'file')) {
      const packageJson = JSON.parse(await fs.readFile(packageJsonFile, 'utf8')) as PackageJson;

      if (packageJson && packageJson.root) {
        return dir;
      }
    }

    const parentDir = path.dirname(dir);

    if (parentDir === dir) {
      throw new Error('Could not find root directory (package.json not found).');
    }

    dir = parentDir;
  }
};
