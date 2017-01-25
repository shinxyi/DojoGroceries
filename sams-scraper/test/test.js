
var api = require('../index')(require('isomorphic-fetch'));

api.search('pampers diapers', function(result) {
  console.log(result);
}, function(err) {
  console.log(err);
});

api.get('/sams/huggies-nb-kit-128-count/prod17380209.ip?subscribe=true&xid=subscribe_search', function(result) {
  console.log(result);
}, function(err) {
  console.log(err);
});
