const { signin } = require("../controllers/employee");

const router = require("express").Router();

router.post("/signin", signin);

module.exports = router;
