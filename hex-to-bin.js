/**
 * Prakhar Sahay 12/01/2017
 */

const fs = require('fs');

if (process.argv.length - 2 < 2) {
	console.error('Please supply input and output file names.');
	process.exit();
}

const sourceFileName = process.argv[2];
const targetFileName = process.argv[3];

let source;
try {
	// The encoding here doesn't seem to matter.
	source = fs.readFileSync(sourceFileName, 'binary');
} catch (err) {
	console.error(`Could not locate ${err.path}.`);
	process.exit();
}

// Whitespace agnostic.
const hex = source.replace(/\s+/g, '').match(/.{2}/g);

const binary = hex.map((word) => String.fromCharCode(parseInt(word, 16)));

// Not checking FnF.
fs.writeFileSync(targetFileName, binary.join(''), {encoding: 'binary'});