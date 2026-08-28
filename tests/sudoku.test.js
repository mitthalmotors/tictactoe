const { test, describe } = require('node:test');
const assert = require('node:assert');

const { isValid } = require('../sudoku.js');

describe('Sudoku isValid', () => {
    const board = [
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

    test('should return true for a valid move', () => {
        assert.strictEqual(isValid(board, 0, 2, 1), true, 'Should be able to place 1 at (0,2)');
        assert.strictEqual(isValid(board, 2, 3, 2), true, 'Should be able to place 2 at (2,3)');
    });

    test('should return false for a number already in the row', () => {
        assert.strictEqual(isValid(board, 0, 2, 5), false, '5 is already in row 0');
    });

    test('should return false for a number already in the column', () => {
        assert.strictEqual(isValid(board, 1, 0, 8), false, '8 is already in column 0');
    });

    test('should return false for a number already in the 3x3 grid', () => {
        assert.strictEqual(isValid(board, 1, 1, 9), false, '9 is already in the top-left grid');
    });

    test('should return false for placing a number where it already exists', () => {
        assert.strictEqual(isValid(board, 0, 0, 5), false, '5 is already at (0,0)');
    });
});
