'use strict';

module.exports = function() {
	let map = new Map();

	this.size = 0;

	this.add = function(key1, key2) {
		if (!map.has(key1)) map.set(key1, new Set());
		let subSet = map.get(key1);
		if (!subSet.has(key2)) this.size++;
		return subSet.add(key2);
	};

	this.has = function(key1, key2) {
		if (!map.has(key1)) return false;
		let subSet = map.get(key1);
		return subSet.has(key2);
	};

	this.delete = function(key1, key2) {
		if (!map.has(key1)) return map.delete(key1);
		let subSet = map.get(key1);
		if (subSet.has(key2)) {
			this.size--;
			if (subSet.size <= 1) return map.delete(key1);
		} 
		return subSet.delete(key2);
	};

	return this;
};