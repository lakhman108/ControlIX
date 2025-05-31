const uuid = require("uuid");

function generateVerificationLink(email) {
  const emailVerificationToken = uuid.v4();
  const emailVerificationLink = `${process.env["SERVER_ROOT_URL"]}/api/v1/user/verifyemail?token=${emailVerificationToken}&email=${email}`;
  return { emailVerificationLink, emailVerificationToken };
}

function generateCustomerAccessLinkForLocation(locationId, token, email) {
  const customerAccessLink = `${process.env["CLIENT_ROOT_URL"]}/api/v1/customer/access?locationId=${locationId}&token=${token}&email=${email}`;
  return { customerAccessLink };
}

function generatePasswordResetLink(currentDateTime, email) {
  const token = uuid.v4();
  const resetLink =
    process.env.CLIENT_ROOT_URL +
    "/reset_password?token=" +
    token +
    "&email=" +
    email +
    "&time=" +
    currentDateTime;
  return { resetLink, token };
}

function getUuidToken() {
  return uuid.v4();
}

module.exports = {
  generateVerificationLink,
  generatePasswordResetLink,
  getUuidToken,
  generateCustomerAccessLinkForLocation,
};