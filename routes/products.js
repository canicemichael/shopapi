const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { Product } = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png", //mime type a call to study
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extention = FILE_TYPE_MAP[file.mimetype]; //the object checks through the array and selects the extention name of the file and assign it to extention variable..
    cb(null, `${fileName}-${Date.now()}.${extention}`);
  },
});

const uploadOptions = multer({ storage: storage });

// router.get(`/`, async (req, res) => {
//   // due to the fact that we don't want to give out the whole property of the info, we use select method to choose some properties .select()
//   // const productList = await Product.find().select("name image -_id");
//   const productList = await Product.find().populate("category");

//   if (!productList) {
//     res.status(500).json({ success: false });
//   }
//   res.send(productList);
// });

router.get(`/`, async (req, res) => {
  // localhost:3000/api/v1/products?categories=24353425,566445
  // lets say we want to return a list of products whose categories are sent on the url queries, all the categories that will be returned, their ID will be in the array of filtering

  let filter = {};
  if (req.query.category) {
    filter = { category: req.query.category.split(",") };
  }

  const productList = await Product.find(filter).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    res.status(404).json({ success: false });
  }
  res.send(product);
});

router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product ID");
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  ).populate("category");

  if (!product) {
    return res
      .status(404)
      .json({ message: "The product with the given ID can not be updated" });
  }
  res.status(200).send(product);
});

router.delete("/:id", async (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "the product is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, err });
    });
});

router.get("/get/count", async (req, res) => {
  // mongoose has alot of methods, where we can get the total amount of a particular entity n many of methods like that

  // Product.countDocuments({ name: "emmanuel" }, function (err, c) {
  //   console.log("Count is " + c);
  // });
  Product.countDocuments(function (err, c) {
    if (!c) {
      res.status(500).json({ success: false });
    } else {
      res.status(200).json({ productCount: c });
    }
  });
});

router.get("/get/featured/:count", async (req, res) => {
  // filtering the number of featured products
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product ID");
    }
    const files = req.files;

    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "The product cannot be updated" });
    }
    res.status(200).send(product);
  }
);

module.exports = router;
