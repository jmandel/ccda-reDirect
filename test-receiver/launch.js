var express = require('express');

var app = express();

app.post('*', function(req, res, next){
  console.log("POST URL", req.originalUrl);
  next();
});

app.post('/incoming/fail/(from/:from)?/(to/:to)?', function(req, res, next){
  console.log("instructed to fail on", req.params);
  next("Err!");
});

app.post('/incoming/succeed/(from/:from)?/(to/:to)?', function(req, res, next){
  console.log("instructed to succeed on", req.params);
  res.end();
});
app.post('*', function(req, res, next){
  console.log("got here", req.originalUrl);
});


console.log(app._router.map.post);

app.listen(process.env.VMC_APP_PORT || 4001);;
