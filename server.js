var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/TorontoStarSports");
app.get("/articles", function(req, res){
  axios.get("https://www.thestar.com/sports.html").then(function(response) {
    var $ = cheerio.load(response.data);

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
    
    $(".media-responsive").children("img").each(function(i, element){
      console.log("hello")
      console.log($(element).attr("src"))
    })

    for(var i = 0; i < summary.length; i++){
      db.Article.create({
        Headline: headline[i],
        Summary:  summary[i],
        URL: URL[i]
      }).then(function(dbArticle){
        console.log(dbArticle)
      }).catch(function(err){
        return res.json(err);
      })
    };
  });
});

app.get("/", function(req, res) {
  res.send("Hello world");
});

app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
