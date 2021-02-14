const { body } = require("express-validator");
const User = require("../models/user.js");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Enter correct email")
    .custom(async (value, { req }) => {
      try {
        const candidate = await User.findOne({ email: value });
        if (candidate) {
          return Promise.reject("Email is already registered");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body("password", "Password min length - 6")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords should be equal");
      }
      return true;
    })
    .trim(),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Enter correct name with more then 3 length")
    .trim(),
];

exports.loginValidators = [
  body("email")
    .isEmail()
    .withMessage("Enter correct email")
    .custom(async (value, { req }) => {
      try {
        const candidate = await User.findOne({ email: value });
        if (candidate) {
          return Promise.reject("Email is already registered");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body("password", "Password min length - 6")
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
];

exports.coursesValidators = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Min length is 3 symbols")
    .trim(),
  body("price").isNumeric().withMessage("Enter correct price"),
  body("img", "Enter correct url of image").isURL(),
];
