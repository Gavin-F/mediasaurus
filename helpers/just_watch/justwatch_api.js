var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var request = require('request');
const URL = require('url');

var DEBUGGING_MODE = false; // true for verbose callback failures

module.exports = {

    // searchForProviders consumes a string (query) and a function(pointer) (callback)
    // passes an Array to the function(pointer) that is an array of JSONObjects
    // example output is in exampleOutput.txt
    searchForProviders: function (query, callback) {
        var api_url = 'https://api.justwatch.com/titles/en_CA/popular';

        var queryOptions = {
            url: URL.parse(api_url),
            type: 'POST',
            json: true,
            body: {
                "content_types":null,
                "presentation_types":null,
                "providers":null,
                "genres":null,
                "languages":null,
                "release_year_from":null,
                "release_year_until":null,
                "monetization_types":null,
                "min_price":null,
                "max_price":null,
                "scoring_filter_types":null,
                "cinema_release":null,
                "query": query
            },
            headers: {
                'User-Agent': 'request'
            }
        };

        request.post(queryOptions, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    callback(body.items[0].offers);
                } else {
                    if (DEBUGGING_MODE) {
                        console.log("error! response: " + response.statusCode);
                    }
                }
        });
    }
}