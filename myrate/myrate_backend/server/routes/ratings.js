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

ratingRoutes.route("/rating/findrating/:username").get(function (req, res) {
  let db_connect = dbo.getDb();
  let mid = req.query.media_id;
  const query = {media_id: ObjectId(mid)};
  let username = req.params.username;
  db_connect
      .collection("ratings")
      .aggregate([
        {
          $match: {
            media_id: ObjectId(mid)
          }
        },
        {
          $match: {
            user_username: username
          }
        }
      ])
      .toArray(function(err, result) {
        if(err) throw err;
        res.json(result);
      })
})

ratingRoutes.route("/rating/findstatrating").get(function (req, res) {
  let db_connect = dbo.getDb();
  let username = req.query.username;
  db_connect
      .collection("ratings")
      .aggregate([
        {
          $match: {
            user_username: username
          }
        }
      ])
      .toArray(function(err, result) {
        if(err) throw err;
        res.json(result);
      })
})

 
// This section will help you create a new rating.
ratingRoutes.route("/rating/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 let day = new Date();
 let myobj = {
    stars: req.body.stars,
    review: req.body.review,
    media_type: req.body.media_type,
    media_id: ObjectId(req.body.media_id),
    user_username: req.body.user,
    timestamp_day: day,
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
 let day = new Date();
 let newvalues = {
   $set: {
    stars: req.body.stars,
    review: req.body.review,
    media_type: req.body.media_type,
    media_id: ObjectId(req.body.media_id),
    user_username: req.body.user,
    timestamp_day: day,
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
ratingRoutes.route("/ratings/delete/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("ratings").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});

ratingRoutes.route("/rating/findothers").get(function (req, res) {
  let db_connect = dbo.getDb();
  let mid = req.query.media_id;
  db_connect
      .collection("ratings")
      .aggregate([
        {
          $match: {
            media_id: ObjectId(mid)
          }
        },
      ])
      .toArray(function(err, result) {
        if(err) throw err;
        res.json(result);
      })
})
 
module.exports = ratingRoutes;