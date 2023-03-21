const express = require("express");
 
// collectionRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /collection.
const collectionRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// This section will help you get a list of all the collections.
collectionRoutes.route("/collection").get(function (req, res) {
 let db_connect = dbo.getDb("media");
 db_connect
   .collection("collections")
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 

// This section will help you get a single collection by id
collectionRoutes.route("/collection/getcollectionid:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("collections")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});


// This section will help you get every collection for user with provided id
collectionRoutes.route("/collection/findcollections").get(function (req, res) {
  let db_connect = dbo.getDb();
  let oid = req.query.owner_id;
  const query = {owner_id: oid};
  const collection = db_connect.collection("collections").findOne(query, function (err, result) {
    if (err) {
      console.log("error in get collection by owner id: " + err);
      throw err;
    }
    res.json(result);
  });
 });

 
// This section will help you create a new collection.
collectionRoutes.route("/collection/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myobj = {
   title: req.body.title,
   description: req.body.description,
   books: [],
   movies: [],
   tvshows: [],
   user: req.body.user,
 };
 db_connect.collection("collections").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
});
 
// This section will help you update a collection by id.
collectionRoutes.route("/collection/update/:id").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };

 let bookIds = req.body.books.map(b => ObjectId(b));
 let movieIds = req.body.movies.map(m => ObjectId(m));
 let tvshowIds = req.body.tvshows.map(t => ObjectId(t));

 let newvalues = {
   $set: {
    title: req.body.title,
    description: req.body.description,
    books: bookIds,
    movies: movieIds,
    tvshows: tvshowIds,
   },
 };
 db_connect
   .collection("collections")
   .updateOne(myquery, newvalues, function (err, res) {
     if (err) throw err;
     console.log("1 collection updated");
     response.json(res);
   });
});
 
// This section will help you delete a collection
collectionRoutes.route("/collection/delete/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("collections").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});

collectionRoutes.route("/collection/getmedia/:username").get(function (req, res) {
    let db_connect = dbo.getDb("media");
    let username = req.params.username;
    db_connect
        .collection("collections")
        .aggregate([
            {
                $match: {
                    user: username
                }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: 'books',
                    foreignField: '_id',
                    as: 'book_list'
                }
            },
            {
                $lookup: {
                    from: 'movies',
                    localField: 'movies',
                    foreignField: '_id',
                    as: 'movie_list'
                }
            },
            {
                $lookup: {
                    from: 'tvshows',
                    localField: 'tvshows',
                    foreignField: '_id',
                    as: 'tvshow_list'
                }
            }

    ])
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

collectionRoutes.route("/collection/user/:id").get(function (req, res) {
  let db_connect = dbo.getDb("media");
  let userId = ObjectId(req.params.id);
  db_connect
      .collection("collections")
      .aggregate([
          {
              $match: {
                  user: userId
              }
          }

  ])
      .toArray(function (err, result) {
          if (err) throw err;
          res.json(result);
      });
});


module.exports = collectionRoutes;

