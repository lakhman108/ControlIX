const auth = require("../../middlewares/auth");
const express = require("express");
const router = express.Router();
const userC = require("../../controllers/user/controller");
const { verificationAndBannedCheck, verificationAndBannedCheckForLogin, existingUser } = require("../../middlewares/userMiddleware")

// Normal User Routes
// user signup
router.post("/signup", existingUser, userC.signup);

// User Login
router.post("/login", userC.login);

// User Verification
router.get("/verifyemail", userC.emailVerification);

// User Forgot Password
router.post("/forgot_password", userC.forgotPassword);

// User Forgot Password Reset
router.post("/forgot_password_reset", userC.forgotPasswordReset);

// User Forgot Password Reset Check
router.post("/forgot_password_reset_check", userC.forgotPasswordResetCheck);

// protected routes
// User Update
router.put("/", auth, verificationAndBannedCheck, userC.updateProfile);

// User Detele All Records
router.delete("/", auth, verificationAndBannedCheck, userC.deleteProfile);

// Curently logged in user
router.get("/me", auth, verificationAndBannedCheck, userC.getMe);

module.exports = router;