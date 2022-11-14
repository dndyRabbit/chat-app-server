const messageModel = require("../models/message.model");
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data)
      return res.status(200).json({
        status: true,
        data: null,
        message: "Successfully added message to database.",
      });

    return res.status(400).json({
      status: false,
      data: null,
      message: "Failed added message to database.",
    });
  } catch (err) {
    next(err);
  }
};
module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    return res.status(200).json({
      status: true,
      data: projectedMessages,
      message: "Success get all messages.",
    });
  } catch (err) {
    next(err);
  }
};
