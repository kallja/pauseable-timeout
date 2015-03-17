'use strict';

var _ = require('lodash');

module.exports = customSetTimeout;

var stateInitialized = 'initialized',
	stateStarted = 'started',
	statePaused = 'paused',
	stateResumed = 'resumed',
	stateFinished = 'finished',
	stateAborted = 'aborted';

function customSetTimeout(callback, duration) {
	return new Timeout(callback, duration, _.slice(arguments, 2));
}

function Timeout(callback, duration, callbackArguments) {
	this.callbackArguments = callbackArguments;
	this.state = stateInitialized;
	this.callback = callback;
	this.remaining = duration;
	this.start();
}

Timeout.prototype.start = function() {
	if (this.state === stateInitialized || this.state === statePaused) {
		this.state = this.state === stateInitialized ? stateStarted : stateResumed;
		this.startedAt = new Date().getTime();
		this.timeout = setTimeout(function (that) {
			that.state = stateFinished;
			that.callback.apply(null, that.callbackArguments);
		}, this.remaining, this);
	}
};

Timeout.prototype.pause = function () {
	if (this.state === stateStarted || this.state === stateResumed) {
		this.state = statePaused;
		this.remaining = this.remaining - (new Date().getTime() - this.startedAt);
		clearTimeout(this.timeout);
		this.timeout = null;
		return this.remaining;
	}
	return false;
};

Timeout.prototype.resume = function () {
	if (this.state === statePaused) {
		this.start();
		return true;
	}
	return false;
};

Timeout.prototype.abort = function () {
	if (this.state === stateStarted ||
			this.state === stateResumed ||
			this.state === statePaused) {
		this.state = stateAborted;
		clearTimeout(this.timeout);
		this.timeout = null;
		return true;
	}
	return false;
};

Timeout.prototype.state = null;