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

app.get("/scrape", function(req, res){
  axios.get("https://www.thestar.com/sports.html").then(function(response) {
    var $ = cheerio.load(response.data);

    var URL = [];
    var headline = [];
    var summary = [];

    var everyT = [];

    $(".story__body a").each(function(i, element){
      var yourl = "https://www.thestar.com" + $(element).attr("href")
      
      db.Article.find({URL: yourl})
        .then(function(data){
          if(data.length === 0){
            URL.push(yourl);
          }
        })
    })

    $(".story__headline").each(function(i, element){
      var head = $(element).text()

      db.Article.find({Headline: head})
        .then(function(data){
          if(data.length === 0){
            headline.push(head)
          }
        })


    })

    $(".story__abstract").each(function(i, element){
      summary.push($(element).text())
    })




    var j = 0;

    for(var i = 0; i < summary.length; i++){
      db.Article.find({Headline: headline[i]})
        .then(function(dat){
          if(dat.length === 0){
            
          }
        })
    }
  });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/note/:id", function(req, res){
  db.Note.find(
    {_id: req.params.id},
  ).then(function(data) {
    res.json(data)
  })
})


app.post("/articles/:id", function(req, res){
  db.Article.updateOne(
    {_id: req.params.id},
    {$set: {Save: true}}
  ).then(function(data) {
    res.json("saved")
  })
})

app.get("/articles/saved", function(req, res){
  db.Article.find({
    Save: true
  })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
})

app.get("/preNote/:id", function(req,res){
  db.Article.findOne({
    _id: req.params.id
  }).then(function(data){
    res.json(data)
  })
})

app.post("/saveDelete/:id", function(req, res){
  db.Article.updateOne(
    {_id: req.params.id},
    {$set: {Save: false}}
  ).then(function(data) {
    res.json("saved")
  })
})

app.post("/artNote/:id", function(req, res){
  db.Note.create(req.body)
    .then(function(dbNote){
      return db.Article.updateOne({ _id: req.params.id }, {$push: { note: dbNote._id }});
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
})

app.post("/deleteArtNote/:id", function(req, res){
  db.Article.updateOne(
    {_id: req.params.id},
    {$unset: {note: 1}}
  ).then(function(db){
    res.json("remove note")
  }).catch(function(err) {
    res.json(err);
  });
})

app.post("/deleteNote/:id", function(req, res){
  db.Note.remove(
    {_id: req.params.id}
  ).then(function(db){
    res.json("remove note")
  }).catch(function(err){
    res.json(err);
  })
})

// app.get("/", function(req, res) {
//   res.send("Hello world");
// });

require("./public/htmlRoute.js")(app);

app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
