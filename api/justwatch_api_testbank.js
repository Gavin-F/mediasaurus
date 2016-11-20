var justwatch_api = require('./justwatch_api');

function printThis(value) {
  console.log(value);
  console.log(typeof value);
}

justwatch_api.searchForProviders('the matrix', printThis);
justwatch_api.searchForProviders('frozen', printThis);
justwatch_api.searchForProviders('twilight', printThis);


// printThis(justwatch_api.searchForProviders('the matrix', printThis));