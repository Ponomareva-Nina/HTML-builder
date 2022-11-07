const fs = require('fs');
const path = require('path');
const { copyFile } = require('node:fs/promises');
const dir = path.join(__dirname, 'files');

async function copyDir(src) {
  try {
    await fs.promises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true});
    clearDir(path.join(__dirname, 'files-copy'));
    const files = await fs.promises.readdir(src);

    files.forEach(file => {
      copyFile(path.join(src, file), path.join(__dirname, 'files-copy', file));
    });
    console.log('Congrats! Directory copied successfully');
  } catch(err) {
    if (err) return console.log(`Failed! Error: ${err.message}`);
  }
}

function clearDir(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) console.log(err.message);
    files.forEach(file => {
      fs.unlink(path.join(dir, file), () => {
      });
    });
  });
}

copyDir(dir);