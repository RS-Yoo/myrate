const express = require("express");
 
// completedRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /completed.
const completedRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// This section will help you get a list of all the completeds.
completedRoutes.route("/completed").get(function (req, res) {
 let db_connect = dbo.getDb("media");
 db_connect
   .collection("completeds")
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 

// This section will help you get a single completed by id
completedRoutes.route("/completed/getcompletedid:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("completeds")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});


// This section will help you get a single completed by media id
completedRoutes.route("/completed/findcompleted").get(function (req, res) {
  let db_connect = dbo.getDb();
  let mid = req.query.media_id;
  const query = {media_id: ObjectId(mid)};
  db_connect
    .collection("completeds")
    .find({media_id: mid})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

completedRoutes.route("/completed/findcompleted/:username").get(function (req, res) {
  let db_connect = dbo.getDb();
  let mid = req.query.media_id;
  const query = {media_id: ObjectId(mid)};
  let username = req.params.username;
  db_connect
      .collection("completeds")
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

completedRoutes.route("/completed/findstatcompleted").get(function (req, res) {
  let db_connect = dbo.getDb();
  let username = req.query.username;
  db_connect
      .collection("completeds")
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

 
// This section will help you create a new completed.
completedRoutes.route("/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myobj = {
    date: req.body.date,
    media_id: ObjectId(req.body.media_id),
    user_username: req.body.user,
 };
 console.log(myobj);
 db_connect.collection("completeds").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
});
 
// This section will help you update a completed by id.
completedRoutes.route("/completed/update/:id").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 let day = new Date();
 let newvalues = {
   $set: {
    date: req.body.date,
    media_id: ObjectId(req.body.media_id),
    user_username: req.body.user,
   },
 };
 db_connect
   .collection("completeds")
   .updateOne(myquery, newvalues, function (err, res) {
     if (err) throw err;
     console.log("1 completed updated");
     response.json(res);
   });
});
 
// This section will help you delete a completed
completedRoutes.route("/completeds/delete/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("completeds").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});

completedRoutes.route("/completed/findothers").get(function (req, res) {
  let db_connect = dbo.getDb();
  let mid = req.query.media_id;
  db_connect
      .collection("completeds")
      .aggregate([
        {
          $match: {
            media_id: ObjectId(mid),
            user_username: req.query.username,
          }
        },
      ])
      .toArray(function(err, result) {
        if(err) throw err;
        else {
            console.log("mid: " + ObjectId(mid));
            console.log("username: " + req.query.username);
            console.log(result);
        }
        res.json(result);
      })
})
 
module.exports = completedRoutes;