'use strict';

const DMap = require('./double-map');
const DSet = require('./double-set');

module.exports = function(levels) {
	let orderMap = new DMap();
	let cache = new DSet();
	let level = 0;

	this.down = function(variable, value) {
		if (!orderMap.has(variable, value)) orderMap.set(variable, value, orderMap.size);
		// let order = orderMap.get(variable, value);
		level++;
	};

	this.up = function() {
		level--;
	};

	this.add = function(variable, value) {
		if (level > 0) return;
		return cache.add(variable, value);
	};

	this.has = function(variable, value) {
		if (level > 0) return false;
		return cache.has(variable, value);
	};

	return this;
};