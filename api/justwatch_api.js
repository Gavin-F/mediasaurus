var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();


module.exports = {


    searchForProviders: function (query, callback) {
        // var data = new FormData();

        // var jsonData = "{'content_types':null, 'presentation_types':null, 'providers':null, 'genres':null, 'languages':null, 'release_year_from':null, 'release_year_until':null, 'monetization_types':null, 'min_price':null, 'max_price':null, 'scoring_filter_types':null, 'cinema_release':null, 'query':" + query + "}";
        var jsonData = '{"content_types":null,"presentation_types":null,"providers":null,"genres":null,"languages":null,"release_year_from":null,"release_year_until":null,"monetization_types":null,"min_price":null,"max_price":null,"scoring_filter_types":null,"cinema_release":null,"query":"' + query + '"}';
        // var header = "{'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36(KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36'}";
        var header = '{"User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36(KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36"}';
        var api_url = 'https://api.justwatch.com/titles/en_CA/popular';
        // console.log("Calling xhr");
        // this.httpGetAsync(api_url, JSON.parse(header), JSON.parse(jsonData), callback);
        // header = {'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36(KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36'}
        return this.httpGet(api_url, JSON.parse(header), JSON.parse(jsonData));
    },

    httpGetAsync: function (theUrl, header, payload, callback) {
        var xmlHttp = xhr;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                console.log("Found something");
                var jsonArr = JSON.parse(xmlHttp.responseText);
                if((typeof jsonArr) === 'object') {
                    var result = jsonArr.items;
                    var offers = result[0].offers;
                    console.log(typeof offers)
                    callback(offers);
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