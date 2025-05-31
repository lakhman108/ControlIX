const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  deviceId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  // 1/- Thermostat -> wk
  // 2/- Bluetooth Door lock ->  mc
  // 3/- Locks that can operate on bluetooth and wifi for common areas -> mc
  // 4/- Elevator controller. -> ele
  // 5/- Bulb -> dj
  deviceType: {
    type: String,
    enum: ['mc', 'dj', 'wk', 'ele'],
    required: true,
    default: 'newbie'
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

deviceSchema.plugin(mongoosePaginate);

deviceSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000 && error.keyPattern && error.keyPattern.deviceId) {
    next(new Error('Device ID already added. Please delete it first from another account before adding again.'));
  } else {
    next(error);
  }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;