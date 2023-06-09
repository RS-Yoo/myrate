const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/book"));
app.use(require("./routes/movie"));
app.use(require("./routes/tvshow"));
app.use(require("./routes/ratings"));
app.use(require("./routes/collection"));
app.use(require("./routes/user"));
app.use(require("./routes/goal"));
app.use(require("./routes/completed"));
// get driver connection
const dbo = require("./db/conn");
 
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});