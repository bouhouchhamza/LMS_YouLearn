import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["learner", "trainer", "admin"],
    default: "learner",
  },
  status: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password,salt);
  } catch (error) {
    throw new error();
  }
});

userSchema.methods.isMatched = async function(password){
    return await bcrypt.compare(password,this.password);
}
const User = mongoose.model('User',userSchema);
export default User;