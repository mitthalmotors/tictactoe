const test = require('node:test');
const assert = require('node:assert');
const { isValid } = require('../sudoku.js');

test.describe('Sudoku isValid', () => {
    const sampleBoard = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    test.it('should return true for a valid move', () => {
        assert.strictEqual(isValid(sampleBoard, 0, 2, 1), true);
    });

    test.it('should return false for a number already in the row', () => {
        assert.strictEqual(isValid(sampleBoard, 0, 2, 5), false);
    });

    test.it('should return false for a number already in the column', () => {
        assert.strictEqual(isValid(sampleBoard, 2, 1, 3), false);
    });

    test.it('should return false for a number already in the 3x3 box', () => {
        assert.strictEqual(isValid(sampleBoard, 1, 1, 5), false);
    });

    test.it('should return true if the number is the same as the one in the cell being checked', () => {
        const boardWithNumber = sampleBoard.map(row => row.slice());
        boardWithNumber[0][2] = 4;
        assert.strictEqual(isValid(boardWithNumber, 0, 2, 4), true);
    });
});
