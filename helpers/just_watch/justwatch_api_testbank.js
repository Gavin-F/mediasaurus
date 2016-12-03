var justwatch_api = require('./justwatch_api');

function printThis(value) {
  console.log(value);
  console.log(typeof value);
}

function printResults() {
    if(results.amount = 0) {
        console.log("" + results.passed + " Tests passed, out of " + results.amount);
    }
    if(results.failed > 0) {
        console.log("WARNING, " + results.failed + " TESTS FAILLED!");
    } else {
        console.log("All tests passed.");
    }
}

results = {
    amount: 0,
    passed: 0,
    failed: 0
};


function test(expected, actual) {
    results.amount++;
    if (expected === actual) {
        results.passed++;
    } else {
        results.failed++;
        console.log("Expected: " + expected + " but got: " + actual);
    }
}

justwatch_api.searchForProviders('the matrix', function(val) {;
    test(17, val.length);
});


justwatch_api.searchForProviders('frozen', function(val) {;
    test(16, val.length);
});


justwatch_api.searchForProviders('twilight', function(val) {;
    test(3, val.length);
});


printResults();