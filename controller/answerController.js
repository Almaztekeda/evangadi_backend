const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

//post answer
async function post_answer(req, res) {
  const { answer } = req.body;
  const questionid = req.params.questionid;
  const { userid } = req.user;
  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide the whole part" });
  }
  try {
    await dbConnection.query(
      "INSERT INTO answers(question_id,userid, answer) value(?,?,?)",
      [questionid, userid, answer]
    );
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Answer posted successfully" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong" });
  }
}

//all answers
async function all_answer(req, res) {
  const questionid = req.params.questionid;
  try {
    const [answer] = await dbConnection.query(
      "SELECT answer, user_name FROM answers JOIN users ON answers.userid = users.userid WHERE question_id = ? ",
      [questionid]
    );
    return res.status(StatusCodes.OK).json({ answer });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong" });
  }
}

module.exports = { post_answer, all_answer };
