const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

async function copyDir(src, dest) {
  await fsPromises.rm(dest, { recursive: true, force: true });
  await fsPromises.mkdir(dest, { recursive: true });
  const files = await fsPromises.readdir(src, { withFileTypes: true });

  for (let file of files) {
    const source = path.join(src, file.name);
    const destination = path.join(dest, file.name);
    if (file.isFile()) {
      await fsPromises.copyFile(source, destination);
    } else {
      await copyDir(source, destination);
    }
  }
}

async function bundleStyles() {
  const bundleWriteStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  const files = await fsPromises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
  for (const file of files) {
    const sourceFilePath = path.join(path.join(__dirname, 'styles'), file.name);
    if (file.isFile() && path.extname(sourceFilePath) === '.css') {
      const styleReadStream = fs.createReadStream(sourceFilePath, 'utf8');
      styleReadStream.pipe(bundleWriteStream);
    }
  }
}

async function createHTML() {
  await fsPromises.copyFile(path.join(__dirname, 'template.html'), path.join(__dirname, 'project-dist', 'index.html'));
  let htmlFileContent = await fsPromises.readFile(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');
  const bundleWriteStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  const files = await fsPromises.readdir(path.join(__dirname, 'components'), { withFileTypes: true });
  for (const file of files) {
    const sourceFilePath = path.join(path.join(__dirname, 'components'), file.name);
    if (file.isFile() && path.extname(sourceFilePath) === '.html') {
      const sourceFileName = path.parse(sourceFilePath).name;
      const htmlFileComponentContent = await fsPromises.readFile(sourceFilePath, 'utf-8');
      htmlFileContent = htmlFileContent.replace(`{{${sourceFileName}}}`, htmlFileComponentContent);
    }
  }
  bundleWriteStream.write(htmlFileContent);
}

(async () => {
  try {
    const srcAssets = path.join(__dirname, 'assets');
    const destAssets = path.join(__dirname, 'project-dist', 'assets');

    await fsPromises.rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true });
    await fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

    await copyDir(srcAssets, destAssets);
    await bundleStyles();
    await createHTML();

    console.log('Project is built successfully. Good luck!');

  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
})();
