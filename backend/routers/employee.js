const { signin, logout } = require("../controllers/employee");
const { requireEmployeeAuth } = require("../middlewares/auth");

const router = require("express").Router();

router.post("/signin", signin);

router.use(requireEmployeeAuth);

router.post("/logout", logout);

module.exports = router;
