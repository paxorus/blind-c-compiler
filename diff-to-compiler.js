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

const diff = fs.readFileSync(diffFileName, 'utf8').split(/\r?\n/);
// .filter(line => line !== '\\ No newline at end of file');

// let lineIdx = 0;

const diffHeaderIndices = diff
	.map((line, idx) => [line, idx])
	.filter(lineIdxTuple => parseInt(lineIdxTuple[0], 10))
	.map(lineIdxTuple => lineIdxTuple[1]);

const diffBlocks = diffHeaderIndices.map((headerIdx, idx, array) => {
	const blockEndIndex = array[idx + 1] || diff.length;// start of next block else EOF
	return diff.slice(headerIdx, array[idx + 1]);
});

diffBlocks.forEach(blockToJsPrint);

function blockToJsPrint(block) {
	const header = block[0];// '141d141'

	const sourceFileIndices = header.match(/^(\d+),(\d+)/);
	let startIdx, endIdx;

	if (sourceFileIndices !== null) {// '217,218c217,218'
		startIdx = parseInt(sourceFileIndices[1], 10);
		endIdx = parseInt(sourceFileIndices[2], 10);
	} else {// '261c261'
		startIdx = endIdx = parseInt(header, 10);
	}

	if (header.includes('a')) {
		const newHalfwords = block.slice(1).reduce((cumul, insertionLine) => {
			return cumul + insertionLine.substring(2);// '> 73' => '2e6273'
		}, '');
		console.log(`[${startIdx - 1}] += '${newHalfwords}';`);
	} else if (header.includes('c')) {
		const deletionBlockSize = endIdx - startIdx + 1;
		// block = header + deletion + dashes + addition
		const additionBlockSize = block.length - deletionBlockSize - 2;
		const newHalfwords = block.slice(block.length - additionBlockSize, block.length).reduce((cumul, insertionLine) => {
			return cumul + insertionLine.substring(2);// '> 73' => '2e6273'
		}, '');
		console.log(`[${startIdx - 1}] = '${newHalfwords}';`);

		// don't delete first line
		range(startIdx + 1, endIdx).forEach(lineNum => {
			console.log(`[${lineNum - 1}] = '';`);
		});
	} else if (header.includes('d')) {
		range(startIdx, endIdx).forEach(lineNum => {
			console.log(`[${lineNum - 1}] = '';`);
		});
	} else {
		throw "This diff is wacky!";
	}
}


function range(x, y) {
	// inclusive range
	return new Array(y - x + 1).fill(0).map((_, idx) => idx + x);
}


function printLineDiff(lineDiffs, lineNum) {
	lineDiffs.forEach(lineDiff => {
		const [newHalfword, columnIdx] = lineDiff;
		const lineIdx = lineNum - 1;
		console.log(`boilerplate[${lineIdx}][${columnIdx}] = '${newHalfword}';`);
	});
}