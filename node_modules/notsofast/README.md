NotSoFast
=========

A simple promise based rate limiter.

Usage
-----

    notsofast = require('notsofast')(options);

    notsofast()
        .then(function () {
            console.log('I can now do what I wanted to do!');
        })
        .catch(function () {
            console.log('Nope, no can do!');
        });

Options
-------

* **timeout** (*integer*) - Milliseconds before unresolved promises get rejected. Defaults to 5000
* **interval** (*integer*) - Milliseconds. Interval at which new tickets are loaded. Defaults to 1000
* **ticketsPerInterval** (*integer*) - Amount of tickets that will be redeemable per interval.
* **bucketSize** (*integer*) - Amount of tickets the bucket can hold before it instantly starts rejecting promises. Defaults to ticketsPerInterval


Error predicates
----------------

NotSoFast is based on bluebird, so you can catch errors with predicates.

    notsofast = require('notsofast')(options);

    notsofast()
        .then(doMyTask)
        .catch(notsofast.timeoutError, function () {
            // Ticket timed out
        })
        .catch(notsofast.bucketFullError, function () {
            // Bucket is full
        })
        .catch(console.log);
