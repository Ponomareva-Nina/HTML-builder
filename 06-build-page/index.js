const fs = require('fs');
const path = require('path');

async function copyAssets(fromDir, toDir) {
  const folders = await fs.promises.readdir(fromDir);
  await fs.promises.rm(path.join(toDir, 'assets'), { recursive: true, force: true });
  await fs.promises.mkdir(path.join(toDir, 'assets'), {recursive: true});

  folders.forEach(async (folder) => {
    await fs.promises.mkdir(path.join(toDir, 'assets', folder), {recursive: true});
    const files = await fs.promises.readdir(path.join(fromDir, folder));
    files.forEach(file => {
      const input = fs.createReadStream(path.join(fromDir, folder, file));
      const output = fs.createWriteStream(path.join(toDir, 'assets', folder, file));
      input.pipe(output);
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
      input.pipe(output);
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
      if (component.split('.')[1] === 'html') {
        const readComponent = fs.createReadStream(path.join(componentsDir, component), 'utf-8');
        let componentContent = '';
        readComponent.on('data', chunk => componentContent += chunk);
        readComponent.on('end', () => {
          htmlPage = htmlPage.replace(`{{${component.split('.')[0]}}}`, componentContent);
          fs.createWriteStream(path.join(toDir, 'index.html')).write(htmlPage);
        });
      }
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