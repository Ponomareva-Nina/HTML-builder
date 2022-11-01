const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const input = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Please write your text below \nor enter "exit" if you want to end session \n');
stdin.on('data', data => {
  if(data.toString().trim() === 'exit') {
    stdout.write('Goodbye and have a nice day!');
    process.exit();
  } else {
    input.write(data);
    stdout.write('Success! Your text was added to file\n');
    stdout.write('To continue input please write your text below \nor enter "exit" if you want to end session \n');
  }
});

process.on('SIGINT', function() {
  console.log('Goodbye and have a nice day!');
  process.exit();
});
