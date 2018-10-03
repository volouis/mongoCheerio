var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  Headline: {
    type: String,
    required: true
  },
  Summary: {
    type: String,
    required: true
  },
  URL: {
    type: String,
    required: true
  },
  Save: {
    type: Boolean,
  },
  note: {
    type: Array,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
