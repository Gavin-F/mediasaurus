// import tmdb_api.js
var tmdb_api = require('./tmdb_api');

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

// tmdb_api.discoverMovies("2017", null, null, null, null, printThis);

// Test 1
// Tests getGenreID

// Check if genreID is properly returned
test(28,tmdb_api.getGenreID("action"));

// Make sure case does not matter
test(28,tmdb_api.getGenreID("ACTion"));



// Test 2
// Tests getMovieWithID

tmdb_api.getMovieWithID(504, function(val) {
    results = JSON.parse(val);
    test("Monster", results.original_title);
    test("en", results.original_language);
});


// Test 3
// test getKeywordID
test(210313, tmdb_api.getKeywordID("action"));
test(14955, tmdb_api.getKeywordID("fighting"));
test(157902, tmdb_api.getKeywordID("psychological"));


printResults();