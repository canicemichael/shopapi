const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors"); // this module aids fetching of api from the client side
require("dotenv/config");
const api = process.env.API_URL;

// before we start using any services in the server, we call the following cors services, it aids fetching http services from the frontend. checkout http options
app.use(cors());
app.options("*", cors());

// middleware
app.use(express.json({ extended: false }));
app.use(morgan("tiny"));

// Routes
const productsRoutes = require("./routes/products");
// const categoriesRoutes = require("./routes/")
// const usersRoutes = require('./routes/')

app.use(`${api}/products`, productsRoutes);

mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://canice:canice@cluster0.iihi0xn.mongodb.net/eshop-database?retryWrites=true&w=majority"
    // {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   dbName: "eshop-database",
    // }
  )
  .then(() => console.log("Database Connected!"));

app.listen(3000, () => {
  console.log(api);
  console.log("Server has started");
});
