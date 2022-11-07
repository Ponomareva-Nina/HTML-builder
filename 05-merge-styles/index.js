const fs = require('fs');
const path = require('path');
const dirToBundle = path.join(__dirname, 'styles');

async function createBundle(dir) {
  const files = await fs.promises.readdir(dir);
  await fs.promises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
  clearBundle(path.join(__dirname, 'project-dist', 'bundle.css'));
  const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

  files.forEach(file => {
    if (file.split('.')[1] === 'css') {
      const input = fs.createReadStream(path.join(dir, file));
      input.pipe(output);
    }
  });
}

function clearBundle(bundle) {
  fs.unlink(bundle, () => {});
}

createBundle(dirToBundle);