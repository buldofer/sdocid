


process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
});


// From nodejs.org/jsconf.pdf slide 56
var http = require("http");
http.createServer(function(req,res){
  res.sendHeader(200,{"Content-Type": "text/plain"});
  tail.addListener("output", function (data) {
    res.sendBody(data);
  });
}).listen(8000);