/**
 * Prakhar Sahay 12/01/2017
 */

const fs = require('fs');

if (process.argv.length - 2 < 1) {
	console.error('Please supply an input file name.');
	process.exit();
}

const sourceFileName = process.argv[2];
const boilerplateFileName = './boilerplate.txt';


// let source;
// try {
// 	// The encoding here doesn't seem to matter.
// 	source = fs.readFileSync(sourceFile, 'binary');
// } catch (err) {
// 	console.error(`Could not locate ${err.path}.`);
// 	process.exit();
// }

const PRINT_A = false;

const boilerplate = fs.readFileSync(boilerplateFileName, 'utf8').split('\r\n').map(line => line.split(' '));
boilerplate[8][4] = '0000';
boilerplate[8][5] = '0000';
boilerplate[13][4] = '0000';

if (PRINT_A) {
	boilerplate[9][0] = '7302';
	boilerplate[16][2] = '7c03';
	boilerplate[21][4] = 'b860';
	boilerplate[24][0] = 'e40c';
	boilerplate[36][4] = '7c03';
	boilerplate[67][0] = 'e813';
	boilerplate[67][1] = '0c00';
	boilerplate[67][4] = 'e8a3';
	boilerplate[67][7] = '7e05';
	boilerplate[71][1] = 'e869';
	boilerplate[72][1] = '0061';
	boilerplate[73][3] = '4e0b';
	boilerplate[74][5] = '3a0b';
	boilerplate[75][7] = '260b';
	boilerplate[76][1] = 'e829';
	boilerplate[77][0] = '6c06';
	boilerplate[77][4] = 'c408';
	boilerplate[77][6] = 'e817';
	boilerplate[80][0] = 'fc0a';
	boilerplate[80][4] = '440b';
	boilerplate[83][7] = 'e8c5';
	boilerplate[89][2] = 'e86f';
	boilerplate[][] = '';
	boilerplate[][] = '';
	boilerplate[][] = '';
	boilerplate[][] = '';

}

const hex = boilerplate;
fs.writeFileSync(sourceFileName + '.hex', hex.map(line => line.join(' ')).join('\n'));