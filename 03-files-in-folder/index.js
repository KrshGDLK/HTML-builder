const fs = require('fs/promises');
const path = require('path');

(async () => {
  try {
    const files = await fs.readdir(path.join(__dirname, './secret-folder'), {
      withFileTypes: true
    });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(__dirname, './secret-folder', file.name);
        const fileName = path.parse(filePath).name;
        const fileExtension = path.extname(filePath).slice(1);
        const fileSize = (await fs.stat(filePath)).size;

        console.log(`${fileName} - ${fileExtension} - ${fileSize / 1024}kb`);
      }
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
})();
