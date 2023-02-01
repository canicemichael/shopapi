const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors"); // this module aids fetching of api from the client side
require("dotenv/config");
const { authJwt } = require("./helpers/jwt");
const { errorHandler } = require("./helpers/error-handler");

const api = process.env.API_URL;

// before we start using any services in the server, we call the following cors services, it aids fetching http services from the frontend. checkout http options
app.use(cors());
app.options("*", cors());

// middleware
app.use(express.json({ extended: false }));
app.use(morgan("tiny"));
app.use(authJwt);
app.use("public/uploads", express.static(__dirname + "public/uploads"));
app.use(errorHandler);

// Routes
const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

mongoose.set("strictQuery", true);
mongoose
  .connect(
    process.env.mongodb
    // {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   dbName: "eshop-database",
    // }
  )
  .then(() => console.log("Database Connected!"));

app.listen(3000, () => {
  console.log("Server has started");
});
