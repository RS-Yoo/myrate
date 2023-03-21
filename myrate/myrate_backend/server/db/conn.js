const { MongoClient } = require("mongodb");
const faker = require("faker");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

const bcrypt = require('bcryptjs');
const saltRounds = 10;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db) {
        _db = db.db("media");
        console.log("Successfully connected to MongoDB.");

        // seed ratings for media
        if(_db.collection("ratings").countDocuments() == 0)
        {
          var savedBooks = _db.collection("books").find().forEach(i => SeedReviews(i, "books"));
          var savedMovies = _db.collection("movies").find().forEach(i => SeedReviews(i, "movies"));
          var savedTVShows = _db.collection("tvshows").find().forEach(i => SeedReviews(i, "tvshows"));
          console.log("Seeded ratings");
        }
        else
        {
          console.log("Ratings already in database. Did not seed.");
        }
      }
      
      const collection = client.db("media").collection("users");
      // Command below updates all users to have a timestamp_day field (note: currently all set to the same) 
      //collection.updateMany({}, {$set:{"timestamp_day": faker.date.past()}}); 
      
      if(collection.countDocuments() == 0)
      {

        // The drop() command destroys all data from a collection.
          // Make sure you run it against proper database and collection.
          try {
            collection.drop();
  
          }
          catch (err)
          {
  
          }
  
          // make a bunch of time series data
          let userData = [];
  
          for (let i = 0; i < 5000; i++) {
              const firstName = faker.name.firstName();
              const lastName = faker.name.lastName();
              const password = bcrypt.hashSync(firstName, saltRounds);

              let newUser = {
                  firstName,
                  lastName,
                  day_joined: faker.date.past(),
                  email: faker.internet.email(firstName, lastName),
                  username: faker.name.firstName() + faker.random.word() + faker.random.alphaNumeric(),
                  password,
              };
  
              userData.push(newUser);
          }
          collection.insertMany(userData);
  
          console.log("User are already in database seeded");
      }
      else
      {
        console.log("Users already in database. Did not seed.")
      }


      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};

async function SeedReviews(media, type) {
  const ratingscollection = client.db("media").collection("ratings");
  //console.log("Attempting to seed reviews for" + type);
  if(ratingscollection.countDocuments()==0)
  {
    console.log("Seeded ratings for " + type);
    // get users collection so that each rating is associated with random seeded user
    const usersCollection = client.db("media").collection("users");
    var userCount = usersCollection.count;
    var randNum = Math.floor(Math.random() * (userCount - 1) + 1);
    let ratingData = [];
    if (ratingscollection.findOne({ "media_id": media._id }).media == type) {
      console.log("returned");
      return;
    }
    for (let i = 0; i < 5; i++) {
      var rUser = await client.db("media").collection("users").aggregate([ { $sample: { size: 1 } } ]).toArray();
      //console.log("User: " + JSON.stringify(rUser));
      //console.log("Ruser: " + JSON.stringify(rUser[0]._id));
      let newRating = {
        stars: faker.datatype.number({
          'min': 1,
          'max': 5
        }),
        review: faker.lorem.paragraph(),
        media_type: type,
        media_id: media._id,
        user_id: rUser[0]._id,
        user_username: rUser[0].username
      };
  
      ratingData.push(newRating);
    }
    ratingscollection.insertMany(ratingData);
  }
  else
  {
    //console.log("Ratings already seeded for " + type + " did not seed.");
  }

}