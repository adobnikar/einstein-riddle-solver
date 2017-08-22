'use strict';

require('console.table');
const EinCache = require('./ein-cache');

function isString(a) {
	return (typeof a === "string");
}

function isNumber(a) {
	return (typeof a === "number");
}

function isArray(a) {
	return (a.constructor === Array);
}

module.exports = {
	einConstructor: function() {
		// Problem constraints data containers.
		let data = null;
		let pieceMap = new Map();
		let puzzleMap = new Map();
		let puzzleSet = new Set();
		
		// State data containers (used for solving).
		let unplacedPuzzles = new Set();
		let placedPieces = new Map();
		let positionMap = new Map();
		let cache = new EinCache(1);

		// Pretty print functions.
		function printPuzzles() {
			// Extract pieces of each puzzle.
			let rows = Array.from(puzzleSet).map((p) => {
				let obj = {};
				for (let key in data) {
					if (!data.hasOwnProperty(key)) continue;
					if (p.pieceMap.has(key)) obj[key] = p.pieceMap.get(key).value;
					else obj[key] = undefined;
				}
				return obj;
			});
			console.table(rows);
		};

		function printPositionMap() {
			let rows = [];
			for (let i = 1; i <= data.positions; i++) {
				let obj = {};
				let posObj = positionMap.get(i);
				for (let key in data) {
					if (!data.hasOwnProperty(key)) continue;
					obj[key] = undefined;
					if (posObj[key] != null) obj[key] = posObj[key].value;
				}
				rows.push(obj);
			}
			console.table(rows);
		};

		// Problem constraint builder functions.
		function analyze(dataParam) {
			data = dataParam;
			for (let key in data) {
				if (!data.hasOwnProperty(key)) continue;
				if (key === "positions") {
					for (let i = 1; i <= data.positions; i++) {
						pieceMap.set(i, {
							type: "positions",
							value: i,
						});
						same(i);
					}
				} else {
					for (let item of data[key]) {
						pieceMap.set(item, {
							type: key,
							value: item,
						});
						same(item);
					}
				}
			}
		};

		function same(...args) {
			let pvals = [];
			for (let a of args) {
				if (isArray(a)) pvals.push.apply(pvals, a);
				else pvals.push(a);
			}
		
			let puzzle = {
				pieces: [],
				pieceMap: new Map(),
				pre: new Set(),
				after: new Set(),
				neighbours: new Set(),
			};
			puzzleSet.add(puzzle);
		
			puzzle.pieces = pvals.map((p) => {
				if (!pieceMap.has(p)) throw new Error("Piece \"" + p + "\" not found.");
				let piece = pieceMap.get(p);
				puzzle.pieceMap.set(piece.type, piece);
				return piece;
			});
			
			// Find any other puzzles containing these pieces and join them.
			let puzzles = new Set();
			for (let piece of puzzle.pieces) {
				if (!puzzleMap.has(piece.value)) continue;
				puzzles.add(puzzleMap.get(piece.value));
			}
			for (let otherPuzzle of puzzles)
				puzzle = joinPuzzles(puzzle, otherPuzzle);
		
			// Map the puzzle.
			for (let piece of puzzle.pieces) puzzleMap.set(piece.value, puzzle);
		
			return puzzle;
		};
		
		function pre(a, b) {
			if (!isArray(a)) a = [a];
			if (!isArray(b)) b = [b];
			let puzzleA = same(a);
			let puzzleB = same(b);
		
			for (let piece of puzzleA.pieces)
				puzzleB.pre.add(piece.value);
			for (let piece of puzzleB.pieces)
				puzzleA.after.add(piece.value);
		};
		
		function neighbours(a, b, preFlag = false) {
			if (!isArray(a)) a = [a];
			if (!isArray(b)) b = [b];
			let puzzleA = same(a);
			let puzzleB = same(b);
		
			for (let piece of puzzleA.pieces)
				puzzleB.neighbours.add(piece.value);
			for (let piece of puzzleB.pieces)
				puzzleA.neighbours.add(piece.value);
		
			if (preFlag) pre(a, b);
		};
		
		function joinPuzzles(a, b) {
			// let puzzle = {
			// 	pieces: [],
			// 	pieceMap: new Map(),
			// 	pre: new Set(),
			// 	after: new Set(),
			// 	neighbours: new Set(),
			// };
			
			// Combine pieces.
			for (let piece of b.pieces) {
				if (a.pieceMap.has(piece.type)) {
					if (a.pieceMap.get(piece.type) !== piece)
						throw new Error("Overlapped pieces do not match.");
					continue;
				}
				a.pieces.push(piece);
				a.pieceMap.set(piece.type, piece);
			}
		
			// Combine pre.
			for (let pval of b.pre) {
				if (a.after.has(pval)) throw new Error("Pre/after conflict when joining two puzzles.");
				a.pre.add(pval);
			}
		
			// Combine after.
			for (let pval of b.after) {
				if (a.pre.has(pval)) throw new Error("Pre/after conflict when joining two puzzles.");
				a.after.add(pval);
			}
		
			// Combine nighbours.
			for (let pval of b.neighbours) a.neighbours.add(pval);
		
			puzzleSet.delete(b);
			return a;
		};

		// Solver functions.
		function canBePlaced(puzzle, pos) {
			// Check if this puzzle can be placed here.
			let posObj = positionMap.get(pos);
			for (let piece of puzzle.pieces) {
				if (posObj[piece.type] == null) continue;
				if (posObj[piece.type] !== piece) return false;
			}
			for (let pval of puzzle.pre) {
				if (!placedPieces.has(pval)) continue;
				if (placedPieces.get(pval) >= pos) return false; 
			}
			for (let pval of puzzle.after) {
				if (!placedPieces.has(pval)) continue;
				if (placedPieces.get(pval) <= pos) return false; 
			}
			for (let pval of puzzle.neighbours) {
				if (!placedPieces.has(pval)) continue;
				if (Math.abs(placedPieces.get(pval) - pos) !== 1) return false;
			}
			return true;
		}

		function place(puzzle, pos) {
			let posObj = positionMap.get(pos);
			// Remove the puzzle from unplaced puzzles.
			unplacedPuzzles.delete(puzzle);
			// Place the pieces.
			let piecesToUnset = [];
			for (let piece of puzzle.pieces) {
				if (posObj[piece.type] != null) continue;
				piecesToUnset.push(piece);
				posObj[piece.type] = piece;
				placedPieces.set(piece.value, pos);
			}
			puzzle.piecesToUnset = piecesToUnset;
			puzzle.pos = pos;
		}

		function unplace(puzzle) {
			let piecesToUnset = puzzle.piecesToUnset;
			let posObj = positionMap.get(puzzle.pos);

			// Unplace pieces.
			for (let piece of piecesToUnset) {
				posObj[piece.type] = null;
				placedPieces.delete(piece.value);
			}

			delete puzzle.piecesToUnset;
			delete puzzle.pos;

			// Add puzzle back to unplaced.
			unplacedPuzzles.add(puzzle);
		}

		function trySet(puzzle, pos, depth, permanent = false) {
			// Check for cache hits.
			if (cache.has(puzzle, pos)) return false;

			// 1. check if possible
			if (!canBePlaced(puzzle, pos)) {
				// Cache result.
				cache.add(puzzle, pos);
				return false;
			}
			if (!permanent && (depth <= 0)) return true;

			// 2. set
			place(puzzle, pos);

			// Move cache down.
			cache.down(puzzle, pos);

			// 3. try place next puzzle
			let result = true;
			if (depth > 0) {
				result = tryPlaceNextPuzzle(depth);
				// Cache result.
				if (!result) cache.add(puzzle, pos);
			}

			// Move cache up.
			cache.up();

			// 4. unset
			if (!permanent || !result) unplace(puzzle);

			// 5. return result
			return result;
		}

		function tryPlaceNextPuzzle(depthMax, permanent = false) {
			// 1. foreach variable
			// 2. foreach value
			// 3. trySet each value
			// 4. remember failed value trySet-s for all lower levels
			// 5. if no value matches return false
			// 6. if only one value matches set it
			// 7. return true

			if (unplacedPuzzles.size <= 0) return true;
			let placedPuzzles = []; // to keep track of the placed puzzles
			let puzzles = Array.from(unplacedPuzzles);

			// Local cache of positions for all puzzles.
			let posesCache = new Map();

			for (let depth = 0; depth < depthMax; depth++) {
				// 1. foreach variable
				for (let puzzle of puzzles) {
					// 2. foreach value
					let poses = Array.from(puzzle.poses);
					let trueCount = 0;
					let tpos = null;
					for (let pos of poses) {
						// 3. trySet each value
						let result = trySet(puzzle, pos, depth);
						if (result) {
							trueCount++;
							tpos = pos;
							if (trueCount > 1) break;
						}
						// 4. remember failed value trySet-s for all lower levels
						else {
							// Local cache all changed puzzle poses.
							if (!posesCache.has(puzzle))
								posesCache.set(puzzle, new Set(puzzle.poses));
							puzzle.poses.delete(pos);
						}
						// If more than one value possible we can skip checking.
						if (trueCount > 1) continue;
					}
					// 5. if no value matches return false
					if (trueCount < 1) {
						// Reset all changes because it can't be solved.
						for (let puzzle of placedPuzzles) unplace(puzzle);
						// Reset puzzle poses from local cache.
						for (let [puzzle, poses] of posesCache) puzzle.poses = poses;
						return false;
					} else if (trueCount === 1) {
						// 6. if only one value matches set it
						let sanityResult = trySet(puzzle, tpos, 0, true);
						if (permanent) {
							printPositionMap();
						}
						// Sanity check if pre-checked placement fails.
						if (!sanityResult) throw new Error('This should never happen.');
						// Keep history of placed puzzles.
						placedPuzzles.push(puzzle);
					}
				}
			}

			// 7. return true
			// Reset all changes if not permanent.
			if (!permanent) {
				for (let puzzle of placedPuzzles) unplace(puzzle);
				// Reset puzzle poses from local cache.
				for (let [puzzle, poses] of posesCache) puzzle.poses = poses;
			}
			return true;
		}

		function solve() {
			// First place the puzzles that contain the positions.
			unplacedPuzzles = new Set(puzzleSet);
			let posarray = [];
			for (let i = 1; i <= data.positions; i++) {
				posarray.push(i);
				let obj = {};
				for (let key in data) {
					if (!data.hasOwnProperty(key)) continue;
					obj[key] = null;
				}
				positionMap.set(i, obj);
				let puzzle = puzzleMap.get(i);
				trySet(puzzle, i, 0, true);
			}

			printPositionMap();

			// Give possible positions to each puzzle.
			let puzzles = Array.from(unplacedPuzzles);
			for (let puzzle of puzzles) {
				puzzle.poses = new Set(posarray);
			}

			let depth = 1;
			let lastUnplacedPuzzlesSize = unplacedPuzzles.size;
			while (unplacedPuzzles.size > 0) {
				console.log('Start IDF search with depth ' + depth);
				let result = tryPlaceNextPuzzle(depth, true);
				if (result !== true) {
					console.log("Could not be solved.");
					return;
				}
				if (unplacedPuzzles.size < lastUnplacedPuzzlesSize) {
					depth = 1;
					lastUnplacedPuzzlesSize = unplacedPuzzles.size;
				} else depth++;
			}

			// Solved - print result.
			console.log('----------------------- Solution ------------------------');
			console.log('');
			printPositionMap();
		}

		// Export functions.
		this.printPuzzles = printPuzzles;
		this.printPositionMap = printPositionMap;

		this.analyze = analyze;
		this.same = same;
		this.pre = pre;
		this.neighbours = neighbours;

		this.solve = solve;

		return this;
	},
};

