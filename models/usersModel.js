const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide an username"],
    minlength: [8, "An username can't be less than 8 letters"],
    maxlength: [25, "An username can't be more than 25 letters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    minlength: 6,
    required: [true, "Please provide password"],
  },
});

//-- Hash password before save db
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

//-- Generate token by instance method
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

userSchema.methods.comparePassword = async function (candiatePassword) {
  const isMatch = await bcrypt.compare(candiatePassword, this.password);
  return isMatch;
};

const User = mongoose.model("users", userSchema);

module.exports = User;
