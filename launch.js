var argv = require("optimist").argv;
var rest = require("restler");
var crypto = require('crypto');
var async = require('async');

var httpHost = argv.http_host || process.env["HTTP_HOST"];
var sourceDir = argv.source_dir || process.env["SOURCE_DIR"];
var progressDir = argv.progress_dir || process.env["PROGRESS_DIR"];

console.log(argv);
Watcher = require("./index");

w = new Watcher({
  sourceDir: sourceDir,
  progressDir: progressDir
});

w.on("incoming", function(filename, message){
  console.log("incoming message", filename);

  if (message.attachments){

    var hash = crypto.createHash('md5').update(message.to[0].address).digest("hex");
    var ccdas = message.attachments.filter(function(a){
      return a.fileName.slice("-3").toLowerCase() === "xml";
    });

    console.log("C-CDA Attachments: ", ccdas.length);

    async.each(ccdas, function(ccda, callback) {
      var complete = false;

      rest.post(httpHost + hash, {
        data: ccda.content.toString(),
        headers: {
          "Content-type": "text/xml"
        }
      }).on('complete', function(data, response){
        if (complete) {
          console.log("compete handler double-called :-(");
          return;
        }
        complete = true;

        console.log("POSTed", filename, response.statusCode);
        if (response.statusCode === 200){
          return callback();
        }
        return callback(response);
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

