const Logs = require("../../models/log");

const ActivityTypes = {
  // Location related activities
  LOCATION_CREATED: 'Location Created',
  LOCATION_REMOVED: 'Location Removed',
  LOCATION_UPDATED: 'Location Updated',

  // User related activities
  USER_LOGIN: 'User Login',
  USER_SIGNUP: 'User signUp',
  USER_VERIFICATION: 'User Verification',
  USER_FORGOT_PASSWORD_INITIATED: 'User Forgot Password Initiated',
  USER_FORGOT_PASSWORD_RESET_SUCCESS: 'User Forgot Password Reset Successful',
  USER_FORGOT_PASSWORD_RESET_CHECK: 'User Forgot Password Reset Check',
  USER_UPDATED: 'User Updated',
  USER_ALL_RECORDS_DELETED: 'User All Records Deleted',

  // Device related activities
  DEVICE_UPDATED: 'Device Updated',
  DEVICE_REMOVED: 'Device Removed',
  DEVICE_CREATED: 'Device Created',

  // Organization related activities
  ORGANIZATION_CREATED: 'Organization Created',
  ORGANIZATION_UPDATED: 'Organization Updated',
  ORGANIZATION_DELETED: 'Organization Deleted',

  // Admin related activities
  ADMIN_ASSIGN_MANAGER: 'Admin Assigned Manager Role',
  ADMIN_MODIFY_MANAGER: 'Admin Modified Manager Role',
  ADMIN_ASSIGN_CUSTOMER: 'Admin Assigned Customer Role',
};

const addDataToLogs = async (
  activityType,
  onActivityId,
  note = "",
  session,
  user = "newbie"
) => {
  if (!Object.values(ActivityTypes).includes(activityType)) {
    throw new Error('Invalid activity type');
  }

  const newLog = new Logs({
    activityType,
    onActivityId,
    note,
    user
  });

  await newLog.save({session});
};

module.exports = { addDataToLogs, ActivityTypes };