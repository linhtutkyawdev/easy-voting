const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Campaign = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  select: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  vote: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  create: {
    type: String,
  },
  status: {
    type: String,
    default: "start",
  },
  hour: {
    type: String,
  },
  minutes: {
    type: String,
  },
  update: {
    type: String,
  },
  endDate: {
    type: String,
  },
});

module.exports = mongoose.model("campaign", Campaign);
