/**
 * Prakhar Sahay 12/02/2017
 *
 * Read in a Unix diff file and generate JavaScript code to apply it to an array
 * of lines as a patch.
 */

const fs = require('fs');

if (process.argv.length - 2 < 1) {
	console.error('Please supply an input file name.');
	process.exit();
}

const diffFileName = process.argv[2];

const diff = fs.readFileSync(diffFileName, 'utf8').split(/\r?\n/).filter(line => line !== '\\ No newline at end of file');

let lineIdx = 0;

while (lineIdx < diff.length) {
// while (lineIdx < 100) {

	const header = diff[lineIdx];

	if (header.includes(',')) {
		const matches = /(\d+),(\d+)/.exec(header);// ["9,10", "9", "10"]

		const startLine = parseInt(matches[1], 10);// 9
		const endLine = parseInt(matches[2], 10);// 10
		const blockSize = endLine - startLine + 1;// 2

		if (blockSize > 10) {
			// it's probably an indel
			console.log(`// Indel in ${startLine},${endLine}`);
		} else {
			for (let blockIdx = 0; blockIdx < blockSize; blockIdx ++) {
				const lineDiff = compareLines(diff[lineIdx + blockIdx + 1], diff[lineIdx + blockSize + blockIdx + 2]);
				printLineDiff(lineDiff, startLine + blockIdx);
			}
		}
		lineIdx += 2 * blockSize + 2;
	} else {
		const sourceLineIdx = parseInt(header, 10);// 14
		const lineDiff = compareLines(diff[lineIdx + 1], diff[lineIdx + 3]);// blockIdx is 0, blockSize is 1
		printLineDiff(lineDiff, sourceLineIdx);// ["5275", 4]
		lineIdx += 4;
	}
}

/**
 *
 * @param lineA "< 5045 0000 4c01 0800 0000 0500 0024 0000"
 * @param lineB "< 6a02 0000 e000 0703 0b01 0218 000e 0000"
 */

function compareLines(lineA, lineB) {
	// A halfword is 2 bytes or four hex values.
	halfwordsA = lineA.substring(2).split(' ');
	halfwordsB = lineB.substring(2).split(' ');
	return halfwordsB.map((halfwordB, idx) => {
		return [halfwordB, idx];
	}).filter(tuple => {
		const [halfwordB, idx] = tuple;
		return halfwordB !== halfwordsA[idx];
	});
}

function printLineDiff(lineDiffs, lineNum) {
	lineDiffs.forEach(lineDiff => {
		const [newHalfword, columnIdx] = lineDiff;
		const lineIdx = lineNum - 1;
		console.log(`boilerplate[${lineIdx}][${columnIdx}] = '${newHalfword}';`);
	});
}