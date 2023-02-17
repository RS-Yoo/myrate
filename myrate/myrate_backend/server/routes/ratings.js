const express = require("express");
 
// ratingRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /rating.
const ratingRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// This section will help you get a list of all the ratings.
ratingRoutes.route("/rating").get(function (req, res) {
 let db_connect = dbo.getDb("media");
 db_connect
   .collection("ratings")
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 

// This section will help you get a single rating by id
ratingRoutes.route("/rating/getratingid:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("ratings")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});


// This section will help you get a single rating by media id
ratingRoutes.route("/rating/findrating").get(function (req, res) {
  let db_connect = dbo.getDb();
  let mid = req.query.media_id;
  const query = {media_id: ObjectId(mid)};
  db_connect
    .collection("ratings")
    .find({media_id: mid})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

 
// This section will help you create a new rating.
ratingRoutes.route("/rating/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myobj = {
    stars: req.body.stars,
    review: req.body.review,
    media_type: req.body.media_type,
    media_id: req.body.media_id
    //user_id: user_id,
 };
 console.log(myobj);
 db_connect.collection("ratings").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
});
 
// This section will help you update a rating by id.
ratingRoutes.route("/rating/update/:id").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 let newvalues = {
   $set: {
    stars: req.body.stars,
    review: req.body.review,
    media_type: req.body.media_type,
    media_id: req.body.media_id
    //user_id: user_id,
   },
 };
 db_connect
   .collection("ratings")
   .updateOne(myquery, newvalues, function (err, res) {
     if (err) throw err;
     console.log("1 rating updated");
     response.json(res);
   });
});
 
// This section will help you delete a rating
ratingRoutes.route("/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("ratings").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});
 
module.exports = ratingRoutes;