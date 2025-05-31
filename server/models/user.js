const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const secret_key = process.env["JWT_SECRET"];

const userSchema = new Schema({
  name: String,
  bio: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  tokens: [{ token: { type: String } }],
  emailVerificationToken: { type: String, require: true },
  isEmailVerified: { type: Boolean, required: true, default: false },
  isBanned: { type: Boolean, required: true, default: false },
  forgotPasswordToken: { type: String, required: true, default: "fpt" },
  forgotPasswordInitiatedDate: { type: Date },
  isForgotPasswordInitiated: { type: Boolean, required: true, default: false },
  role: {
    type: String,
    enum: ["admin", "manager", "customer", "helper", "newbie"],
    required: true,
    default: "newbie",
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
});

userSchema.methods.generateAuthToken = async function () {
  try {
    const now = Math.floor(Date.now() / 1000); // Get current timestamp in seconds

    // Filter out expired tokens
    this.tokens = this.tokens.filter((tokenObj) => {
      try {
        const decoded = jwt.verify(tokenObj.token, secret_key);
        return decoded.exp > now; // Keep only valid tokens
      } catch (error) {
        return false; // Remove invalid/expired tokens
      }
    });

    // Generate a new token
    let newToken = jwt.sign({ _id: this._id }, secret_key, {
      expiresIn: "30d",
    });

    this.tokens.push({ token: newToken }); // Add new token
    await this.save(); // Save changes

    return newToken;
  } catch (err) {
    console.error("Error generating auth token:", err);
    throw err;
  }
};


userSchema.methods.generateAuthTokenForCustomer = async function (days) {
  try {
    const now = Math.floor(Date.now() / 1000); // Get current timestamp in seconds

    // Filter out expired tokens
    this.tokens = this.tokens.filter((tokenObj) => {
      try {
        const decoded = jwt.verify(tokenObj.token, secret_key);
        return decoded.exp > now; // Keep only valid tokens
      } catch (error) {
        return false; // Remove invalid/expired tokens
      }
    });

    // Generate a new token
    let newToken = jwt.sign({ _id: this._id }, secret_key, {
      expiresIn: days + "d",
    });

    this.tokens.push({ token: newToken }); // Add new token
    await this.save(); // Save changes

    return newToken;
  } catch (err) {
    console.error("Error generating auth token:", err);
    throw err;
  }
};

userSchema.methods.getPublicProfile = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    bio: this.bio,
    isEmailVerified: this.isEmailVerified,
    isBanned: this.isBanned,
    organization: this.organization,
    role: this.role
  };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
