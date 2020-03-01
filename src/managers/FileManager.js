import path from 'path';
import { fs } from '../utils';

export default class FileManager {
  /* copy all directory recursively */
  static async copyDir(source, destination) {
    const files = await fs.readdir(source);

    await Promise.all(files.map(async (name) => {
      const sourcePath = `${source}/${name}`;
      const destinationPath = `${destination}/${name}`;

      const stat = await fs.lstat(sourcePath);
      if (stat.isDirectory()) {
        if (!fs.existsSync(destinationPath)) {
          fs.mkdir(destinationPath);
        }
        await FileManager.copyDir(sourcePath, destinationPath);
      } else if (!fs.existsSync(destinationPath)) {
        await fs.copyFile(sourcePath, destinationPath);
      }
    }));
  }

  static makePath(relativePath) {
    return path.resolve(process.cwd(), relativePath);
  }

  static async updateFile(path, updater) {
    const fullFilePath = FileManager.makePath(path);
    const file = await fs.readFile(fullFilePath);
    await fs.writeFile(fullFilePath, updater(file));
  }
}
