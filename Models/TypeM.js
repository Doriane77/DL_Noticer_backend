const mongoose = require("mongoose");

const typesSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
});

const Types = mongoose.model("Types", typesSchema);

module.exports = Types;
