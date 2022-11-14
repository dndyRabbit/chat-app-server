const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user)
      return res.status(400).send({
        status: false,
        data: null,
        message: "Username doesn't exist.",
      });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).send({
        status: false,
        data: null,
        message: "Password incorrect.",
      });

    delete user.password;

    return res.status(200).json({
      status: true,
      data: user,
      message: "Login Successfully.",
    });
  } catch (err) {
    next(err);
  }
};
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    const emailCheck = await User.findOne({ email });

    if (usernameCheck)
      return res.status(400).send({
        status: false,
        data: null,
        message: "Username already exist.",
      });

    if (emailCheck)
      return res.status(400).send({
        status: false,
        data: null,
        message: "Email already exist.",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });
    delete user.password;

    return res.status(200).json({
      status: true,
      data: user,
      message: "Register Successfully.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;

    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });

    return res.status(200).json({
      status: true,
      data: {
        isAvatarImageSet: true,
        avatarImage,
      },
      message: "Berhasil mengatur avatar. ",
    });
  } catch (err) {
    next(err);
  }
};
module.exports.getAllUser = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const contacts = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    return res.status(200).json({
      status: true,
      data: contacts,
      message: "Berhasil mengambil contacts. ",
    });
  } catch (err) {
    next(err);
  }
};
