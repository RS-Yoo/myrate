const express = require("express");
 
// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /user.
const userRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// This section will help you get a list of all the users.
userRoutes.route("/user").get(function (req, res) {
 let db_connect = dbo.getDb("media");
 db_connect
   .collection("users")
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 

// This section will help you get a single user by id
userRoutes.route("/user/getuserid/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("users")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});

/*
* Returns userCredentials object in result.data if username exists in system.
* Otherwise result is set to null.
*/
userRoutes.route("/user/finduser/:username").get(function (req, res) {
  let db_connect = dbo.getDb("media");
  const query = {username : req.params.username};
  db_connect.collection("users").findOne(query, function (err, result) {
    if (err) {
      res.status(500);
      res.json(null);
    }
    else if (result == null) {
      res.status(200);
      res.json(null);
    }
    else {
      res.status(200);
      res.json(result);
    }
  });
});

// This section will help you get a single user by username and password
userRoutes.route("/user/finduser").get(function (req, res) {
  let db_connect = dbo.getDb();
  let username = req.query.username;
 // let password = req.query.password;
  const query = {username: username};
  const user = db_connect.collection("users").findOne(query, function (err, result) {
    if (err) {
      console.log("error in get user by title and author: " + err);
      throw err;
    }
    res.json(result);
  });
 });

 
// This section will help you create a new user.
userRoutes.route("/user/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myobj = {
   username: req.body.username,
   password: req.body.password,
   firstname: req.body.firstname,
   lastname: req.body.lastname,
   email: req.body.email,
   role: req.body.role,
   day_joined: req.body.day_joined,
   about: req.body.about,
 };
 db_connect.collection("users").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
});
 
// This section will help you update a user by id.
userRoutes.route("/user/updateAbout/:username").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myquery = { username: req.params.username };
 let newvalues = {
   $set: {
    /*
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    role: req.body.role,
    day_joined: req.body.day_joined,
    */
    about: req.body.about,
   },
 };
 db_connect
   .collection("users")
   .updateOne(myquery, newvalues, function (err, res) {
     if (err) throw err;
     console.log("1 user updated");
     response.json(res);
   });
});
 
// This section will help you delete a user
userRoutes.route("/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("users").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});
 
module.exports = userRoutes;