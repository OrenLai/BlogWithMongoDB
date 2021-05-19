//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "This is a practice website that I implemented with Node.js NPM Express , mongoose/Atlas database , Git and deployed with Heroku.";
const aboutContent = "I was a software Engineer for 5 years back in Taiwan , and I am working on web development course for becoming a programmer again.";
const contactContent = "Please check my Linkedin profile for more information , please feel free to contact with me if you have any question";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true},));
app.use(express.static("public"));

// connect to local database with mongoose and use/create an database named postsDB
//mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser: true , useUnifiedTopology: true});
//connect to atlas
mongoose.connect("mongodb+srv://admin-oren:admin-oren@blogposts.reebj.mongodb.net/BLOGWITHDATABASE",{
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const postSchema = {
  title : String,
  content : String
}

const Post = mongoose.model("post",postSchema);

app.get("/", function(req, res){

  Post.find(function(err,posts){
    if(err){
      //console.log(err);
    }else{
      //console.log(posts);
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    }
  })


});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const newPost = new Post({
    title: req.body.postTitle,
    content : req.body.postBody
  })

  //add a callback function to the save method ,
  // so that it will only redirect to the root route after it saves the new post to the database with no error
  newPost.save(function(err){
    if(!err){
        res.redirect("/");
    }
  });

});

app.get("/post/:_id", function(req, res){

  const requestedId = req.params._id;
  console.log("requestedId = " + requestedId);

  // Oren : loop through the posts array that get from the find method to find the post that matches the id
  // console.log("the typeof requestedId is " + typeof(requestedId));
  // Post.find(function(err,posts){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     //console.log(posts);
  //     //looping throught the
  //     posts.forEach(function(post){
  //
  //       const storedId = post._id;
  //       //console.log("storedId = "+ storedId);
  //       console.log("the typeof storedId is " + typeof(storedId));
  //       if (storedId == requestedId) {
  //         console.log("id matches , going to render page with id =" + requestedId);
  //         res.render("post", {
  //           title: post.title,
  //           content: post.content,
  //         });
  //       }
  //     });
  //   }
  // });

  Post.findOne({_id:requestedId},function(err,post){
    if (!err){
      //console.log(post);
      res.render("post",{
        title: post.title,
        content: post.content,
      });
    }else{
      console.log(err);
    }
  })

});

let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started successfully.");
});
