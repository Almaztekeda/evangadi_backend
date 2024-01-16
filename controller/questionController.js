const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { uuid } = require("uuidv4");

//post question
async function postQuestion(req, res) {
  const { title, description, tag } = req.body;
  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide the whole part" });
  }
  const userid = req.user.userid;
  const questionid = uuid();
  try {
    await dbConnection.query(
      "INSERT INTO questions(question_id,userid,title,description,tag ) value(?,?,?,?,?)",
      [questionid, userid, title, description, tag]
    );
    return res.status(StatusCodes.CREATED).json({
      msg: "Question posted successfully. Redirecting to home page .",
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong" });
  }
}

//all questions
async function allQuestions(req, res) {
  try {
    const [allQuestion] = await dbConnection.query(
      "SELECT q.title, q.description, q.question_id ,q.tag ,u.user_name  FROM questions q JOIN users u ON q.userid = u.userid ORDER BY id DESC;"
    );
    return res.status(StatusCodes.OK).json({ allQuestion });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong" });
  }
}

//single questions
async function singleQuestions(req, res) {
  const questionid = req.params.questionid;
  try {
    const query = "SELECT * FROM questions WHERE question_id = ?";
    const [question] = await dbConnection.query(query, [questionid]);

    if (question.length === 0) {
      return req.status(404).json({ msg: "Question not found" });
    }
    res.status(200).json(question[0]);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong" });
  }
}

module.exports = { postQuestion, allQuestions, singleQuestions };
