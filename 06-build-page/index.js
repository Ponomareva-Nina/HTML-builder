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

async function bundleStyles(fromDir, toDir) {
  const files = await fs.promises.readdir(fromDir);
  fs.unlink(path.join(toDir, 'style.css'), () => {});
  const output = fs.createWriteStream(path.join(toDir, 'style.css'));

  files.forEach(file => {
    if (file.split('.')[1] === 'css') {
      const input = fs.createReadStream(path.join(fromDir, file));
      pipeline(
        input,
        output,
        err => {
          if (err) return console.log(`Failed! Error: ${err.message}`);
        }
      );
    }
  });
}

async function createBundle() {
  const distPath = path.join(__dirname, 'project-dist');
  await fs.promises.mkdir(distPath, {recursive: true});
  copyAssets(path.join(__dirname, 'assets'), distPath);
  bundleStyles(path.join(__dirname, 'styles'), distPath);
}

createBundle();