/**
 * Prakhar Sahay 12/03/2017
 */

const fs = require('fs');

if (process.argv.length - 2 < 1) {
	console.error('Please supply an input file name.');
	process.exit();
}

const txtFileName = process.argv[2];
const text = read(txtFileName).split(/\r?\n/);

text.forEach(line => {// ''
	const halfwords = line.replace(/\s+/g, '').match(/.{2}/g);
	halfwords.forEach(halfword => {
		console.log(halfword);
	});
});

function read(fileName) {
	try {
		// The encoding here doesn't seem to matter.
		return fs.readFileSync(fileName, 'ascii');
	} catch (err) {
		console.error(`Could not locate ${err.path}.`);
		process.exit();
	}	
}
