const Customer = require("../../models/Customer");
const Organization = require("../../models/Organization");
const Location = require("../../models/Location");
const Device = require("../../models/Device");
const User = require("../../models/user");
const {
  generateCustomerAccessLinkForLocation,
} = require("../../utils/generateVerifyLink");
const { sendEmailWithSendGrid } = require("../../config/sendgridEmail");
const { customerAccessLinkMailScript } = require("../../utils/emailScript");

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, locationId, days } = req.body;

    const randomPassword = Math.random().toString(36).substring(2, 8);
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "customer",
      organization: req.rootUser.organization,
      emailVerificationToken: "test",
    });
    const token = await user.generateAuthTokenForCustomer(days);
    const { customerAccessLink } = generateCustomerAccessLinkForLocation(
      locationId,
      token,
      email
    );
    user.emailVerificationToken = customerAccessLink;

    await sendEmailWithSendGrid(
      "Verification on ControlX",
      [email],
      customerAccessLinkMailScript(name, customerAccessLink)
    )
      .then(() => {
        user.save();
        res
          .status(201)
          .json({ message: "Customer created successfully", user });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyCustomerAccessLink = async (req, res) => {
  try {
    const { email, locationId } = req.body;
    const user = req.rootUser;
    if (!user.emailVerificationToken.includes(locationId))
      return res
        .status(403)
        .json({ error: "You are not authorized to access this location" });
    if (user.email !== email)
      return res
        .status(403)
        .json({ error: "You are not authorized to access this location" });
    res
      .status(200)
      .json({ message: "Customer access link verified successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a customer role (delete customer)
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await User.findByIdAndDelete(id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a customer role (update customer)
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.organizationId) {
      const org = await Organization.findById(updates.organizationId);
      if (!org)
        return res.status(404).json({ message: "Organization not found" });
      updates.organization = updates.organizationId;
    }
    if (updates.locationId) {
      const loc = await Location.findById(updates.locationId);
      if (!loc) return res.status(404).json({ message: "Location not found" });
      updates.location = updates.locationId;
    }
    const customer = await Customer.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all customers by organization
exports.getCustomersByOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const customers = await Customer.find({ organization: organizationId });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Customer sends command to device
exports.sendCommandToDevice = async (req, res) => {
  try {
    const { customerId, deviceId } = req.params;
    const { command } = req.body;

    // Optionally, check if customer owns the device or has access
    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const device = await Device.findById(deviceId);
    if (!device) return res.status(404).json({ message: "Device not found" });

    // Simulate sending command (replace with actual device communication logic)
    // For example, you might push to a message queue or call an external API
    // Here, just respond with a success message
    res.json({ message: `Command '${command}' sent to device ${deviceId}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
