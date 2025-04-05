const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const RegisterSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]).{8,}$/.test(
            v
          );
        },
        message: "Password must contain at least one letter and one number.",
      },
    },
    role: {
      type: String,
      enum: ["patient", "ambulance", "hospital", "bloodbank","admin"],
      required: true,
      default: "patient",
    },
  },
  { timestamps: true }
);

RegisterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error); // Log errors for debugging
    next(error);
  }
});

RegisterSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Register = mongoose.model("Register", RegisterSchema, "register");
const Users = mongoose.model("Users", RegisterSchema, "users");
module.exports = { Register, Users };
