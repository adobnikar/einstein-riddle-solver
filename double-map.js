'use strict';

module.exports = function() {
	let map = new Map();

	this.size = 0;

	this.set = function(key1, key2, value) {
		if (!map.has(key1)) map.set(key1, new Map());
		let subMap = map.get(key1);
		if (!subMap.has(key2)) this.size++;
		return subMap.set(key2, value);
	};

	this.has = function(key1, key2) {
		if (!map.has(key1)) return false;
		let subMap = map.get(key1);
		return subMap.has(key2);
	};

	this.get = function(key1, key2) {
		let subMap = map.get(key1);
		if (!map.has(key1)) return subMap;
		return subMap.get(key2);
	};

	this.delete = function(key1, key2) {
		if (!map.has(key1)) return map.delete(key1);
		let subMap = map.get(key1);
		if (subMap.has(key2)) {
			this.size--;
			if (subMap.size <= 1) return map.delete(key1);
		} 
		return subMap.delete(key2);
	};

	return this;
};