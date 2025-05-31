const isAdmin = async (req, res, next) => {
  try {
    var user = req.rootUser;
    // This is for the admin and installation guys who is gonna do the device installation and other things
    // to the devices. i.e. installing devices and repairing the devices
    if (!["admin"].includes(user.role)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports = {
    isAdmin
};
