const express = require("express");
const { post_answer, all_answer } = require("../controller/answerController");
const router = express.Router();

router.post("/postanswer/:questionid", post_answer);
router.get("/allanswer/:questionid", all_answer);
module.exports = router;
