
var url = require('url') ;
function baseurl(req){
    var hostname = req.headers.host; // hostname = 'localhost:8080'
    var pathname = url.parse(req.url).pathname; // pathname = '/MyApp'
    const myurl = 'http://' + hostname;
    return myurl;
}
module.exports = {
    baseurl: baseurl
  };