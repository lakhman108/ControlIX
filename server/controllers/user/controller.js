const User = require("../../models/user");
const { CustomError } = require("../../models/customError");
const { addDataToLogs, ActivityTypes } = require("../log/controller");
const {
  validateEmailAndPasswordForSignup,
} = require("../../middlewares/emailAndPasswordValidation");
const {
  generateVerificationLink,
  generatePasswordResetLink,
} = require("../../utils/generateVerifyLink");
const {
  verificationAndBannedCheckForLogin,
} = require("../../middlewares/userMiddleware");
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const {
  userVerificationLinkMailScript,
  userVerifiedLinkMailScript,
  userResetPasswordLinkScript,
} = require("../../utils/emailScript");
const { sendEmailWithSendGrid } = require("../../config/sendgridEmail");
const {
  userVerificationMiddlePage,
} = require("../../utils/serverHtmlPageResponse");

const login = async (req, res, next) => {
  const session = await mongoose.startSession();
  // starting transaction
  session.startTransaction();
  try {
    const { user } = req.body;
    const { email, password } = user;

    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      const matched = await bcrypt.compare(password, existingUser.password);

      if (matched) {
        var chkAccess = await verificationAndBannedCheckForLogin(existingUser);

        if (!chkAccess) {
          throw new CustomError(
            "You are not allowed to perform this action!",
            401
          );
        }
        const token = await existingUser.generateAuthToken();
        await addDataToLogs(
          ActivityTypes.USER_LOGIN,
          existingUser._id,
          "",
          session
        );
        await session.commitTransaction(); // Commit the transaction
        session.endSession();

        const publicProfile = existingUser.getPublicProfile();
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });
        return res.status(200).json({
          user: publicProfile,
          message: "User logged in successfully",
        });
      } else {
        throw new CustomError("Password is not correct!", 401);
      }
    } else {
      throw new CustomError("User not found!", 404);
    }
  } catch (error) {
    if (session) {
      // aborting transaction
      await session.abortTransaction();
      session.endSession();
    }
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Something went wrong!";
    return res.status(statusCode).json({ error: errorMessage });
  }
};

const signup = async (req, res, next) => {
  const session = await mongoose.startSession();
  // starting transaction
  session.startTransaction();
  try {
    const { user } = req.body;

    const { password, email, name } = user;
    // console.log(user);
    const validationResult = validateEmailAndPasswordForSignup(email, password);

    if (validationResult.error) {
      throw new CustomError(validationResult.message, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    var { emailVerificationLink, emailVerificationToken } =
      generateVerificationLink(email);

    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      emailVerificationToken,
    });
    const saveUserPromise = await newUser.save({ session });
    await sendEmailWithSendGrid(
      "Verification on ControlX",
      [email],
      userVerificationLinkMailScript(name, emailVerificationLink)
    )
      .then(async () => {
        await addDataToLogs(
          ActivityTypes.USER_SIGNUP,
          saveUserPromise._id,
          "",
          session
        ).then(async () => {
          await session.commitTransaction(); // Commit the transaction
          session.endSession();
          return res.status(201).json({
            message:
              "Verification Link Sent Successfully, Please check your mailBox for verification!",
          });
        });
      })
      .catch((error) => {
        throw new CustomError(error.message || "Something went wrong!", 500);
      });
  } catch (error) {
    if (session) {
      // aborting transaction
      await session.abortTransaction();
      session.endSession();
    }
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Something went wrong!";
    return res.status(statusCode).json({ error: errorMessage });
  }
};

const emailVerification = async (req, res, next) => {
  const session = await mongoose.startSession();
  // starting transaction
  session.startTransaction();

  try {
    const { token, email } = req.query;
    if (!token || !email) {
      await session.abortTransaction(); // Rollback the transaction
      session.endSession();
      return res.send(
        userVerificationMiddlePage(
          "You went wrong",
          process.env.CLIENT_ROOT_URL
        )
      );
    } else {
      var existingUser = await User.findOne({
        email,
        emailVerificationToken: token,
      }).session(session);

      if (existingUser) {
        existingUser.emailVerificationToken = "";
        existingUser.isEmailVerified = true;
        await sendEmailWithSendGrid(
          "You are verified on ControlX",
          [email],
          userVerifiedLinkMailScript(existingUser.name)
        );
        await existingUser.save({ session });
        await addDataToLogs(
          ActivityTypes.USER_VERIFICATION,
          existingUser._id,
          "",
          session
        );
        await session.commitTransaction(); // Commit the transaction
        session.endSession();
        return res.send(
          userVerificationMiddlePage(
            "You are verified",
            `${process.env.CLIENT_ROOT_URL}/login`
          )
        );
      } else {
        await session.abortTransaction(); // Rollback the transaction
        session.endSession();
        return res.send(
          userVerificationMiddlePage(
            "User not found on ControlX",
            process.env.CLIENT_ROOT_URL
          )
        );
      }
    }
  } catch (error) {
    await session.abortTransaction(); // Rollback the transaction
    session.endSession();
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { user } = req.body;
    const { email } = user;
    var existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      var chkAccess = await verificationAndBannedCheckForLogin(existingUser);

      if (!chkAccess) {
        throw new CustomError(
          "You are not allowed to perform this action!",
          401
        );
      }
      var currentDateTime = Date.now();
      const { resetLink, token } = generatePasswordResetLink(
        currentDateTime,
        email
      );
      existingUser.isForgotPasswordInitiated = true;
      existingUser.forgotPasswordToken = token;
      existingUser.forgotPasswordInitiatedDate = currentDateTime;
      sendEmailWithSendGrid(
        "Password Reset Link",
        [email],
        userResetPasswordLinkScript(existingUser.name, resetLink)
      )
        .then(async () => {
          await existingUser.save();
          await addDataToLogs(
            ActivityTypes.USER_FORGOT_PASSWORD_INITIATED,
            existingUser._id,
            "",
            session
          );
          await session.commitTransaction(); // Commit the transaction
          session.endSession();
          return res.status(200).json({
            message: "Reset link sent successfully to your email 🚀",
          });
        })
        .catch((error) => {
          throw new CustomError("Request failed for resetting password!", 500);
        });
    } else {
      throw new CustomError("User not found!", 404);
    }
  } catch (error) {
    if (session) {
      // aborting transaction
      await session.abortTransaction();
      session.endSession();
    }
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Something went wrong!";
    return res.status(statusCode).json({ error: errorMessage });
  }
};

const forgotPasswordReset = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { user } = req.body;
    const { email, time, token, password } = user;
    var existingUser = await User.findOne({
      email: email,
      forgotPasswordInitiatedDate: time,
      forgotPasswordToken: token,
      isForgotPasswordInitiated: true,
    }).session(session);

    if (existingUser) {
      var chkAccess = await verificationAndBannedCheckForLogin(existingUser);

      if (!chkAccess) {
        throw new CustomError(
          "You are not allowed to perform this action!",
          401
        );
      }
      const validationResult = validateEmailAndPasswordForSignup(
        email,
        password
      );
      if (validationResult.error) {
        throw new CustomError(validationResult.message, 400);
      }
      const currentTime = Date.now();
      const linkCreationTime = parseInt(
        existingUser.forgotPasswordInitiatedDate
      );
      const timeDifference = currentTime - linkCreationTime;
      const thirtyMinutesInMillis = 30 * 60 * 1000;

      if (timeDifference > thirtyMinutesInMillis) {
        existingUser.forgotPasswordToken = token;
        existingUser.forgotPasswordInitiatedDate = null;
        existingUser.isForgotPasswordInitiated = false;
        await session.commitTransaction(); // Commit the transaction
        session.endSession();
        return res
          .status(401)
          .json({ error: "Reset Password Link Time Period Expired!" });
      }

      existingUser.forgotPasswordToken = "fpt";
      existingUser.forgotPasswordInitiatedDate = null;
      existingUser.isForgotPasswordInitiated = false;

      const hashedPassword = await bcrypt.hash(password, 12);
      existingUser.password = hashedPassword;

      await existingUser.save({ session });
      await addDataToLogs(
        ActivityTypes.USER_FORGOT_PASSWORD_RESET_SUCCESS,
        existingUser._id,
        "",
        session
      );
      await session.commitTransaction(); // Commit the transaction
      session.endSession();
      return res.status(200).json({
        message: "Password Reset Successfully 🚀",
      });
    } else {
      throw new CustomError("You are not allowed to perform this action!", 401);
    }
  } catch (error) {
    if (session) {
      // aborting transaction
      await session.abortTransaction();
      session.endSession();
    }
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Something went wrong!";
    return res.status(statusCode).json({ error: errorMessage });
  }
};

const forgotPasswordResetCheck = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { user } = req.body;
    const { email, time, token } = user;

    var existingUser = await User.findOne({
      email: email,
      forgotPasswordInitiatedDate: time,
      forgotPasswordToken: token,
      isForgotPasswordInitiated: true,
    }).session(session);

    if (existingUser) {
      var chkAccess = await verificationAndBannedCheckForLogin(existingUser);

      if (!chkAccess) {
        throw new CustomError(
          "You are not allowed to perform this action!",
          401
        );
      }
      const currentTime = Date.now();
      const linkCreationTime = parseInt(
        existingUser.forgotPasswordInitiatedDate
      );
      const timeDifference = currentTime - linkCreationTime;
      const thirtyMinutesInMillis = 30 * 60 * 1000;

      if (timeDifference > thirtyMinutesInMillis) {
        existingUser.forgotPasswordToken = token;
        existingUser.forgotPasswordInitiatedDate = null;
        existingUser.isForgotPasswordInitiated = false;
        await session.commitTransaction(); // Rollback the transaction
        session.endSession();
        return res.status(401).json({ error: "Reset Password Link Expired!" });
      }

      // const token = getUuidToken();
      // existingUser.forgotPasswordToken = token;
      await existingUser.save();
      await addDataToLogs(
        ActivityTypes.USER_FORGOT_PASSWORD_RESET_CHECK,
        existingUser._id,
        "",
        session
      );
      await session.commitTransaction(); // Commit the transaction
      session.endSession();
      return res.status(200).json({
        message: "You can reset your password 🚀",
      });
    } else {
      throw new CustomError("You are not allowed to perform this action!", 401);
    }
  } catch (error) {
    if (session) {
      // aborting transaction
      await session.abortTransaction();
      session.endSession();
    }
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Something went wrong!";
    return res.status(statusCode).json({ error: errorMessage });
  }
};

const updateProfile = async (req, res, nxt) => {
  const session = await mongoose.startSession();
  // starting the mongoose transaction
  session.startTransaction();

  try {
    const { user } = req.body;

    const allowedAttributes = ["name", "bio"];

    const filteredUser = allowedAttributes.reduce((acc, attribute) => {
      if (user.hasOwnProperty(attribute)) {
        acc[attribute] = user[attribute];
      }
      return acc;
    }, {});

    await User.findByIdAndUpdate(
      { _id: req.userId },
      { $set: filteredUser },
      { session }
    );
    await addDataToLogs(ActivityTypes.USER_UPDATED, req.userId, "", session);
    await session.commitTransaction(); // Commit the transaction
    session.endSession();
    return res.status(201).json({
      message: "User Updated Successfully!",
    });
  } catch (error) {
    if (session) {
      // aborting transaction
      await session.abortTransaction();
      session.endSession();
    }
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Something went wrong!";
    return res.status(statusCode).json({ error: errorMessage });
  }
};

const deleteProfile = async (req, res, nxt) => {
  const session = await mongoose.startSession();
  // starting the mongoose transaction
  session.startTransaction();

  try {
    await User.findByIdAndDelete({ _id: req.userId }, { session });

    await addDataToLogs(
      ActivityTypes.USER_ALL_RECORDS_DELETED,
      req.userId,
      "",
      session
    );

    await session.commitTransaction(); // Commit the transaction
    session.endSession();

    return res.status(201).json({
      message: "User Deleted Successfully!",
    });
  } catch (error) {
    await session.abortTransaction(); // Rollback the transaction
    session.endSession();
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

const getMe = async (req, res, nxt) => {
  try {
    return res.status(201).json({
      message: "User Retrived Successfully!",
      user: await req.rootUser.getPublicProfile(),
    });
  } catch (error) {
    return res.status(500).json({ error: "Something Went Wrong" });
  }
};

module.exports = {
  signup,
  login,
  emailVerification,
  forgotPassword,
  forgotPasswordReset,
  forgotPasswordResetCheck,
  updateProfile,
  deleteProfile,
  getMe,
};
