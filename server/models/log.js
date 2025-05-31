const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  // Basic log information
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  // Who performed the action
  user: {
    type: String,
  },
  // Type of activity
  activityType: {
    type: String,
  },
  onActivityId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  note: {
    type: String,
  },
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;