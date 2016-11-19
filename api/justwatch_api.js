var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var request = require('request');
const URL = require('url');


module.exports = {


    // searchForProviders: function (query, callback) {
    //     var r = request.post('https://api.justwatch.com/titles/en_CA/popular', callback);
    //     var form = r.form();
    //     form.append('content_types': null);
    //     form.append('presentation_types':null);
    //     form.append('providers':null);
    //     form.append('genres':null);
    //     form.append('languages':null);
    //     form.append('release_year_from':null);
    //     form.append('release_year_until':null);
    //     form.append('monetization_types':null);
    //     form.append('min_price':null);
    //     form.append('max_price':null);
    //     form.append('scoring_filter_types':null);
    //     form.append('cinema_release':null);
    //     form.append('query':null);
    // },

    searchForProviders: function (query, callback) {
        // var data = new FormData();
        
        // var jsonData = "{'content_types':null, 'presentation_types':null, 'providers':null, 'genres':null, 'languages':null, 'release_year_from':null, 'release_year_until':null, 'monetization_types':null, 'min_price':null, 'max_price':null, 'scoring_filter_types':null, 'cinema_release':null, 'query':" + query + "}";
        var jsonData = '{"content_types":null,"presentation_types":null,"providers":null,"genres":null,"languages":null,"release_year_from":null,"release_year_until":null,"monetization_types":null,"min_price":null,"max_price":null,"scoring_filter_types":null,"cinema_release":null,"query":"' + query + '"}';
        // var header = "{'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36(KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36'}";
        var header = '{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36(KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36"}';
        var api_url = 'https://api.justwatch.com/titles/en_CA/popular';
        // console.log("Calling xhr");

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
                // 'User-Agent':"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36(KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36",
                'User-Agent': 'request'
            }
        };

        // callback(request.post(api_url, JSON.parse(jsonData), JSON.parse(header)));
        // request(queryOptions, callback);
        console.log("about to send data");
        var finished = false;
        var count = 0;
        request.post(queryOptions, function(error, response, body) {
            while(!finished) {
                if (!error && response.statusCode == 200) {
                    finished = true;
                    callback(body);
                } else {
                    console.log("error!" + response.statusCode + count);
                    count++;
                }
            }
        });

        // callback(request.post(queryOptions));
        // this.httpGetAsync(api_url, JSON.parse(header), JSON.parse(jsonData), callback);
        // header = {'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36(KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36'}
        // return this.httpGet(api_url, JSON.parse(header), JSON.parse(jsonData));
    },

    httpGetAsync: function (theUrl, header, payload, callback) {
        var xmlHttp = xhr;
        // console.log("Starting call");
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                console.log("Found something");
                if (typeof(xmlHttp.responseText) === 'string') {
                    // var jsonArr = JSON.parse(xmlHttp.responseText);
                    if((typeof jsonArr) === 'object') {
                        var result = jsonArr.items;
                        var offers = result[0].offers;
                        console.log(typeof offers)
                        callback(offers);
                    }
                }
        };
        xmlHttp.open("GET", theUrl, true); // true for asynchronous
        xmlHttp.setRequestHeader('custom-header', header);
        xmlHttp.send(payload);
    },

    httpGet: function (theUrl, header, payload) {
        var xmlHttp = xhr;
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.setRequestHeader('custom-header', header);
        xmlHttp.send(payload);
        return xmlHttp.responseText;
    }
}