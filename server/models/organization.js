const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  address: {
    type: String
  },
  contact: {
    type: String
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
organizationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Add custom error handling for duplicate organization names
organizationSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000 && error.keyPattern.name) {
    next(new Error('Organization name already exists'));
  } else {
    next(error);
  }
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
