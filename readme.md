# pauseable-timeout

```js
var setPTimeout = require('pauseable-timeout');

var timeout = setPTimeout(function (greeting, greetee, isExclamation) {
	console.log('%s, %s%s', greeting, greetee, isExclamation ? '!' : '.');
}, 1000, 'Hello', 'world', true);

var secondTimeout = setPTimeout(function () {
	console.log('I will never get printed to the console, because my timeout will get aborted. :(');
}, 1000);

// Pause the first timeout and abort the second after 500 ms
setTimeout(function() {
	timeout.pause();

	secondTimeout.abort();

	// Resume after 500 ms of having been paused
	setTimeout(function() {
		timeout.resume();
	}, 500);
}, 500);
```

This module provides funtionality similar to the standard NodeJS setTimeout-function (which is used internally).

The main difference is that setTimeout-function defined by this module allows the timeout to be paused and resumed any number of times in addition to being cancelled (aborted).