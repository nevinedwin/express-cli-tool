import fs from 'fs';
import path, { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';


const copyTemplate = (source, destination) => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  };

  const files = fs.readdirSync(source);
  for (let i = 0; i < files.length; i++) {
    const sourcePath = path.join(source, files[i]);
    const destinationPath = path.join(destination, files[i]);

    if (fs.statSync(sourcePath).isDirectory()) {
      copyTemplate(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  };
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename).replace(/\/scripts$/, "");

const sourceDir = path.join(__dirname, 'src', 'templates');
const destinationDir = path.join(__dirname, 'dist', 'templates');

copyTemplate(sourceDir, destinationDir);