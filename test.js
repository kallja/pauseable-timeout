'use strict';

var startTimeout = require('./pauseable-timeout'),
	chai = require('chai');

chai.should();

describe('pauseable-timeout', function () {
	describe('setTimeout', function () {
		it('should invoke callback in no less than 500 ms', function (done) {
			var startTime = new Date().getTime();
			startTimeout(function () {
				(new Date().getTime() -  startTime).should.be.at.least(500, 'callback invoked too soon');
				done();
			}, 500)
		});

		it('should invoke callback in no less than 750 ms when paused for 250 ms', function (done) {
			var startTime = new Date().getTime();
			var timeout = startTimeout(function () {
				(new Date().getTime() -  startTime).should.be.at.least(750, 'callback invoked too soon');
				done();
			}, 500)
			timeout.pause();
			setTimeout(function () {
				timeout.resume();
			}, 250);
		});

		it('should invoke callback in no less than 1000 ms when paused twice for 250 ms', function (done) {
			var startTime = new Date().getTime();
			var timeout = startTimeout(function () {
				(new Date().getTime() -  startTime).should.be.at.least(1000, 'callback invoked too soon');
				done();
			}, 500)
			timeout.pause();
			setTimeout(function () {
				timeout.resume();
				setTimeout(function () {
					timeout.pause();
					setTimeout(function () {
						timeout.resume();
					}, 250);
				}, 250);
			}, 250);
		});

		it('should invoke callback in no less than 500 ms with given arguments', function (done) {
			var these = 'these',
				are = 'are',
				inputs = 'inputs';

			var startTime = new Date().getTime();
			startTimeout(function (arg1, arg2, arg3) {
				(new Date().getTime() -  startTime).should.be.at.least(500, 'callback invoked too soon');

				arg1.should.equal(these, 'first argument is not "these"');
				arg2.should.equal(are), 'second argument is not "are"';
				arg3.should.equal(inputs, 'third argument is not "inputs"');

				done();
			}, 500, these, are, inputs);
		});
	});
});