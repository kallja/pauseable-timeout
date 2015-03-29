'use strict';

var _ = require('lodash');

module.exports = customSetTimeout;

var STATE_INITIALIZED = 'initialized',
	STATE_STARTED = 'started',
	STATE_PAUSED = 'paused',
	STATE_RESUMED = 'resumed',
	STATE_FINISHED = 'finished',
	STATE_ABORTED = 'aborted';

function customSetTimeout(callback, duration) {
	return new Timeout(callback, duration, _.slice(arguments, 2));
}

function Timeout(callback, duration, callbackArguments) {
	this.callbackArguments = callbackArguments;
	this.state = STATE_INITIALIZED;
	this.callback = callback;
	this.remaining = duration;
	this.start();
}

Timeout.prototype.start = function() {
	if (this.state === STATE_INITIALIZED || this.state === STATE_PAUSED) {
		this.state = this.state === STATE_INITIALIZED ? STATE_STARTED : STATE_RESUMED;
		this.startedAt = new Date().getTime();
		this.timeout = setTimeout(function (that) {
			that.state = STATE_FINISHED;
			that.callback.apply(null, that.callbackArguments);
		}, this.remaining, this);
	}
};

Timeout.prototype.pause = function () {
	if (this.state === STATE_STARTED || this.state === STATE_RESUMED) {
		this.state = STATE_PAUSED;
		this.remaining = this.remaining - (new Date().getTime() - this.startedAt);
		clearTimeout(this.timeout);
		this.timeout = null;
		return this.remaining;
	}
	return false;
};

Timeout.prototype.resume = function () {
	if (this.state === STATE_PAUSED) {
		this.start();
		return true;
	}
	return false;
};

Timeout.prototype.abort = function () {
	if (this.state === STATE_STARTED ||
			this.state === STATE_RESUMED ||
			this.state === STATE_PAUSED) {
		this.state = STATE_ABORTED;
		clearTimeout(this.timeout);
		this.callback = this.callbackArguments = this.timeout = null;
		return true;
	}
	return false;
};

Timeout.prototype.state = null;