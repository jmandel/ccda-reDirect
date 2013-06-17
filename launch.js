var argv = require("optimist").argv;
var rest = require("restler");
var crypto = require('crypto');
var async = require('async');
var template = require('url-template');

var sourceDir = argv.source_dir || process.env["SOURCE_DIR"];
var progressDir = argv.progress_dir || process.env["PROGRESS_DIR"];
var httpPostUrlTemplate = argv.ccda_post_url || process.env["CCDA_POST_URL"];
var httpPostUrl = template.parse(httpPostUrlTemplate);

console.log(argv);
Watcher = require("./watcher");

w = new Watcher({
  sourceDir: sourceDir,
  progressDir: progressDir
});

w.on("incoming", function(filename, message){
  console.log("incoming message", filename);
  console.log(message);

  if (message.attachments){

    var posts = [];

    var ccdas = message.attachments.filter(function(a){
      return a.fileName.slice("-3").toLowerCase() === "xml";
    });

    message.to.forEach(function(to){

      var url = httpPostUrl.expand({
        to: message.to[0].address,
        from: message.from[0].address
      });

      ccdas.forEach(function(ccda){
        posts.push({url: url, ccda:  ccda});
      });

    });

    console.log("C-CDA Attachments: ", ccdas.length);
    async.each(posts, function(p, callback) {
      console.log("POSTing to ", p.url);
      rest.post(p.url, {
        data: p.ccda.content.toString(),
        headers: {"Content-type": "text/xml"}
      }).on('complete', function(data, response){
        if (response && response.statusCode === 200){
          console.log("POSTed ", filename, response ? response.statusCode : null);
          return callback();
        }
        console.log("Err posting", filename, response);
        return callback(response||"Null response");
      });
    }, function(err){
      if (!err) {
        w.markComplete(filename);
        console.log("Marked progress for ", filename);
      } else {
        console.log("Error POSTing for", filename);
      }
    });
  }
});
