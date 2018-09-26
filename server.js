var express = require("express");
var cheerio = require("cheerio");
var request = require("request");
var mongoose = require("mongoose");
var app = express();

app.use(express.static("public"));

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var articleSchema = new mongoose.Schema({
    Headline: STRING, 
    Summary: STRING, 
    URL: STRING
})

var Article = mongoose.model('Article', articleSchema);

request("https://www.thestar.com/sports.html", function(error, response, html) {

  var $ = cheerio.load(html);

  var results = [];

  var URL = [];
  var headline = [];
  var summary = [];

  $(".story__body a").each(function(i, element){
    URL.push("https://www.thestar.com/sports.html" + $(element).attr("href"));
  })

  $(".story__headline").each(function(i, element){
    headline.push($(element).text())
  })

  $(".story__abstract").each(function(i, element){
    summary.push($(element).text())
  })
//   console.log($(".media-responsive.media-responsive-4by3 img"));
//   $(".media-responsive img").attr("src");

  for(var i = 0; i < summary.length; i++){
      results.push({
          Headline: headline[i],
          Summary:  summary[i],
          URL: URL[i]
      })
  }

  db.article.insert()
  
});

db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/", function(req, res) {
  res.send("Hello world");
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});
