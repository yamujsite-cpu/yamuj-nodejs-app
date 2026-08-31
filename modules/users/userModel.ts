import { hash } from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    passwordResetCode: String,
    passwordResetExpires: Number,
    passwordResetVerified: Boolean,
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  // Hashing user password
  this.password = await hash(this.password, 12);
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
