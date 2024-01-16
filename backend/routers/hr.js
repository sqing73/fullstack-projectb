const { signin } = require("../controllers/hr");

const router = require("express").Router();

router.post("/signin", signin);

module.exports = router;
