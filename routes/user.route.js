const {
  register,
  login,
  setAvatar,
  getAllUser,
} = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/set-avatar/:id", setAvatar);
router.get("/get-alluser/:id", getAllUser);

module.exports = router;
