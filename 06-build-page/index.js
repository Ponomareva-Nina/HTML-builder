const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');


function clearDir(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      fs.unlink(path.join(dir, file), () => {
      });
    });
  });
}

async function copyAssets(fromDir, toDir) {
  const folders = await fs.promises.readdir(fromDir);
  await fs.promises.mkdir(path.join(toDir, 'assets'), {recursive: true});

  folders.forEach(async (folder) => {
    clearDir(path.join(toDir, 'assets', folder));
    await fs.promises.mkdir(path.join(toDir, 'assets', folder), {recursive: true});
    const files = await fs.promises.readdir(path.join(fromDir, folder));
    files.forEach(file => {
      pipeline(
        fs.createReadStream(path.join(fromDir, folder, file)),
        fs.createWriteStream(path.join(toDir, 'assets', folder, file)),
        err => {
          if (err) return console.log(`Something went wrong! Error: ${err.message}`);
        }
      );
    });
  });
}

async function createBundle() {
  const distPath = path.join(__dirname, 'project-dist');
  await fs.promises.mkdir(distPath, {recursive: true});
  await copyAssets(path.join(__dirname, 'assets'), distPath);
}

createBundle();