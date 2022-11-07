const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

(async () => {
  try {
    const bundleWriteStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
    const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });

    for (const file of files) {
      const sourceFilePath = path.join(path.join(__dirname, 'styles'), file.name);

      if (file.isFile() && path.extname(sourceFilePath) === '.css') {
        const styleReadStream = fs.createReadStream(sourceFilePath, 'utf8');
        styleReadStream.pipe(bundleWriteStream);
      }
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
})();
