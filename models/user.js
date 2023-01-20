const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  street: {
    type: String,
    default: ''
  },
  apartment: {
    type: String,
    default: ''
  },
  zip: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  }
});

// inorder to change _id key to id which my mongoDB creates for every document I created, we use the following method, this change will enable us to use
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
}); 

const User = mongoose.model("User", userSchema);

module.exports = { User, userSchema };
