const { body } = require("express-validator");
const { signin, logout } = require("../controllers/hr");
const { addRegistration } = require("../controllers/registration");
const { requireHrAuth } = require("../middlewares/auth");

const router = require("express").Router();

router.post("/signin", signin);

router.use(requireHrAuth);

router.post("/logout", logout);

router.post(
  "/add-registration",
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("name").isLength({ min: 1 }).withMessage("Enter a valid name "),
  addRegistration
);

module.exports = router;
