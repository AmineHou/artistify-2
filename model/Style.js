const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const styleSchema = new Schema(
  {
    name: String,
    color: {
      type: String,
      default: "#000",
    },
    wikiURL: String,
  },
  { timestamps: true }
);

const StyleModel = mongoose.model("style", styleSchema);

module.exports = StyleModel;
