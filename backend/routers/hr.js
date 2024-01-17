const { signin, logout } = require("../controllers/hr");
const { requireHrAuth } = require("../middlewares/auth");

const router = require("express").Router();

router.post("/signin", signin);

router.use(requireHrAuth);

router.post("/logout", logout);

module.exports = router;
