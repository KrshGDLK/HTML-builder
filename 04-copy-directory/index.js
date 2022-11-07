const fs = require('fs/promises');
const path = require('path');

(async () => {
  try {
    await fs.rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true });
    await fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
    const files = await fs.readdir(path.join(__dirname, 'files'));

    for (let file of files) {
      const source = path.join(path.join(__dirname, 'files'), file);
      const destination = path.join(path.join(__dirname, 'files-copy'), file);
      await fs.copyFile(source, destination);
    }

    console.log('Folder has been copied.');

  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
})();
