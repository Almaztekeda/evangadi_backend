const express = require("express");
const router = express.Router();

//authentication middleware
const authMiddleware = require("../middleware/authMiddleware");
const {
  postQuestion,
  allQuestions,
  singleQuestions,
} = require("../controller/questionController");
router.post("/post_question", postQuestion);

router.get("/all-questions", allQuestions);
router.get("/question/:questionid", singleQuestions);

module.exports = router;
