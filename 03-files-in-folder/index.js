const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const dir = path.join(__dirname, 'secret-folder');

fs.readdir(dir, {withFileTypes: true}, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if (file.isFile()) {
      fs.stat(path.join(dir, file.name), (err, stats) => {
        if (err) throw err;
        let sizeInKb = stats.size / 1000;
        stdout.write(file.name.split('.')[0] + ' - ' + path.extname(file.name).slice(1) + ' - ' + sizeInKb + 'kb\n');
      });
    }
  });
});