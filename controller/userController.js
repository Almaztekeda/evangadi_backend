//db connection
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { user_name, first_name, last_name, email, password } = req.body;

  if (!user_name || !first_name || !last_name || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  try {
    const [user] = await dbConnection.query(
      "select user_name, userid from users where user_name = ? or email = ?",
      [user_name, email]
    );

    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user already existed" });
    }
    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must be at least 8 characters" });
    }

    //encrypt the password
    const salt = await bcrypt.genSalt(10);

    const hashedpassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "INSERT INTO users(   user_name, first_name, last_name, email, password) VALUES (?,?,?,?,?)",
      [user_name, first_name, last_name, email, hashedpassword]
    );

    return res.status(StatusCodes.CREATED).json({ msg: "user register" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "something went wrong,try again later!" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter all required fields" });
  }
  try {
    const [user] = await dbConnection.query(
      "select user_name, userid,password from users where email = ?",
      [email]
    );
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credential" });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credential tesastehal" });
    }

    const user_name = user[0].user_name;
    const userid = user[0].userid;
    const token = jwt.sign({ user_name, userid }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "user login successful", token, user_name });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong,try again later!" });
  }
}

async function checkUser(req, res) {
  try {
    const user_name = req.user.user_name;
    const userid = req.user.userid;
    res.status(StatusCodes.OK).json({ msg: "valid user", user_name, userid });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

module.exports = { register, login, checkUser };
