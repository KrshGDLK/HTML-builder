const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Hello! Please, enter text!\n(Type "exit" or press Ctrl + C to quit)\n\n');

stdin.on('data', (data) => {
    if (data.toString().trim() === 'exit') {
        process.exit();
    }
    output.write(data);
});

process.on('exit', () => stdout.write('\nHave a nice day!\n'));
process.on('SIGINT', () => process.exit());
