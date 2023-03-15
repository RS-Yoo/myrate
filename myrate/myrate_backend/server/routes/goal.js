const express = require("express");
 
// goalRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /goal.
const goalRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// This section will help you get a list of all the goals.
goalRoutes.route("/goal").get(function (req, res) {
 let db_connect = dbo.getDb("media");
 db_connect
   .collection("goals")
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 

// This section will help you get a single goal by id
goalRoutes.route("/goal/getgoalid/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("goals")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});


// This section will help you get a single goal by title and author
goalRoutes.route("/goal/findgoal").get(function (req, res) {
  let db_connect = dbo.getDb();
  let title = req.query.goalTitle;
  let author = req.query.goalAuthor;
  const query = {goalTitle: title, goalAuthor: author};
  const goal = db_connect.collection("goals").findOne(query, function (err, result) {
    if (err) {
      console.log("error in get goal by title and author: " + err);
      throw err;
    }
    res.json(result);
  });
 });

 goalRoutes.route("/goal/findgoal/:username").get(function (req, res) {
    let db_connect = dbo.getDb();
    let mid = req.query.media_id;
    const query = {media_id: ObjectId(mid)};
    let username = req.params.username;
    db_connect
        .collection("goals")
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

 goalRoutes.route("/goal/findstatgoal").get(function (req, res) {
    let db_connect = dbo.getDb();
    let username = req.query.username;
    db_connect
        .collection("goals")
        .aggregate([
          {
            $match: {
              username: username
            }
          }
        ])
        .toArray(function(err, result) {
          if(err) throw err;
          res.json(result);
        })
  })

 
// This section will help you create a new goal.
goalRoutes.route("/goal/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myobj = {
   username: req.body.username,
   goalTitle: req.body.goalTitle,
   mediaType: req.body.mediaType,
   daymonthyear: req.body.daymonthyear,
   positive: req.body.positive,
   amount: req.body.amount,
   measurement: req.body.measurement,
 };
 db_connect.collection("goals").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
});
 
// This section will help you update a goal by id.
goalRoutes.route("/update/:id").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 let newvalues = {
   $set: {
    username: req.body.username,
    goalTitle: req.body.goalTitle,
    mediaType: req.body.mediaType,
    daymonthyear: req.body.daymonthyear,
    positive: req.body.positive,
    amount: req.body.amount,
    measurement: req.body.measurement,
   },
 };
 db_connect
   .collection("goals")
   .updateOne(myquery, newvalues, function (err, res) {
     if (err) throw err;
     console.log("1 document updated");
     response.json(res);
   });
});
 
// This section will help you delete a goal
goalRoutes.route("/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("goals").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});
 
module.exports = goalRoutes;