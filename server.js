
// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var exphbs = require("express-handlebars");
var path = require("path");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();
var port = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb:heroku_lvsl5vlq:fgbmfokndipb5a87m0k4mqt8h@ds153609.mlab.com:53609/heroku_lvsl5vlq");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});


//Sets up handlebars as view engine
app.engine("handlebars", exphbs({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, '/views/layouts/partials')
}));
app.set("view engine", "handlebars");

// Static directory
app.use(express.static("./public"));



// Routes
// ======

// app.get('/', function (req, res) {
//   res.render("index");
// });

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.echojs.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  // res.send("Scrape Complete");
});

// This will get the articles we scraped from the mongoDB that are UNSAVED
app.get("/", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({"saved": false}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      //send to index.handlebars "scraped" documents
      res.render("index", { scraped: doc });
    }
  });
});

//when save article is saved, it will update the "saved" to true
app.post("/savedarticles/:id",function (req,res) {
          Article.findOneAndUpdate({_id: req.params.id}, {$set:{ saved: true }}, function (err,docs) {
            if(err){
              console.log("some error occurred in update");
            }else{
              console.log("updated document", docs);
            }
            });
        });﻿


//when delete article button is click, it will update the saved to false
app.post("/deletesavedarticle/:id",function (req,res) {
          Article.findOneAndUpdate({_id: req.params.id}, {$set:{ saved: false }}, function (err,docs) {
            if(err){
              console.log("some error occurred in update");
            }else{
              console.log("updated document", docs);
            }
          });
        });﻿





//find all articles that have saved: true and then send a json file.
app.get("/savedarticles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({ "saved": true }, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.render("savedarticles", { saved: doc });
    }
  });
});

//find the notes associated with this id and then send back the information to the modal
app.get("/findNotesToThisId/:id", function (req,res) {
          Article.findOne({_id: req.params.id}, function(error, doc){
            console.log("within this article" + doc)
            if(error){
              console.log("some error occurred in update");
            }else{
              console.log("found Article: ", doc);
              Note.findOne({_id: doc.note}, function(error, docNote){
                if(error){
                  console.log("some error occurred in update");
                }else{
                  console.log("found Note", docNote);
                }
                res.json(docNote)
              });
          }
          });
        });﻿


app.post("/submitnote/:id", function (req, res){
// Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.json(doc);
        }
      });
    }
  });
});





app.listen(port, function() {
  console.log("App listening on PORT " + port);
});
