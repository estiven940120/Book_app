const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose
  .connect("mongodb://mongo/mybooks", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("Db is connected to", db.connection.host))
  .catch((err) => console.error(err));
