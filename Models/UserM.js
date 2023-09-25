const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const usersSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reviews" }],
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ratings" }],
});
usersSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});
const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
