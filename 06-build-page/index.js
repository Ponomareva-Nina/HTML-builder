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

async function createLayout(componentsDir, toDir) {
  let htmlPage = '';
  const readTemplate = fs.createReadStream(path.join(__dirname, 'template.html'),'utf-8');
  const components = await fs.promises.readdir(componentsDir);

  readTemplate.on('data', data => htmlPage += data);
  readTemplate.on('end', () => {
    components.forEach(component => {
      const readComponent = fs.createReadStream(path.join(componentsDir, component), 'utf-8');
      let componentContent = '';
      readComponent.on('data', chunk => componentContent += chunk);
      readComponent.on('end', () => {
        htmlPage = htmlPage.replace(`{{${component.split('.')[0]}}}`, componentContent);
        fs.createWriteStream(path.join(toDir, 'index.html')).write(htmlPage);
      });
    });
  });
}

async function buildPage() {
  const distPath = path.join(__dirname, 'project-dist');
  await fs.promises.mkdir(distPath, {recursive: true});
  copyAssets(path.join(__dirname, 'assets'), distPath);
  bundleStyles(path.join(__dirname, 'styles'), distPath);
  createLayout(path.join(__dirname, 'components'), distPath);
}

buildPage();