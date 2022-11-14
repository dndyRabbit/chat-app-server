const {
  addMessage,
  getAllMessage,
} = require("../controllers/messages.controller");

const router = require("express").Router();

router.post("/add-message", addMessage);

router.post("/get-all-message", getAllMessage);

module.exports = router;
