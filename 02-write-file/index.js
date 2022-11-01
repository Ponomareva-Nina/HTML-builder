const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const input = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('To end session write "exit"\n');
stdout.write('To start input please write your text below:\n');
stdin.on('data', data => {
  if(data.toString().trim() === 'exit') {
    stdout.write('Ok, bye!');
    process.exit();
  } else {
    input.write(data);
    stdout.write('Success! Your text was added to file\n');
    stdout.write('To continue input please write your text below:\n');
  }
});

process.on('SIGINT', function() {
  console.log('Ok, bye!');
  process.exit();
});
