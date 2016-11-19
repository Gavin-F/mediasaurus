var justwatch_api = require('./justwatch_api');

function printThis(value) {
  console.log(value);
  console.log(typeof value);
}

printThis("Hello");
justwatch_api.searchForProviders('the matrix', printThis);
// printThis(justwatch_api.searchForProviders('the matrix', printThis));