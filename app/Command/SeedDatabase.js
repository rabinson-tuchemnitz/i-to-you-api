const RolesConstant = require("../Constants/RolesConstant");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");

const seedUsersInDatabase = async () => {
  await require("../../bootstrap/database")();

  const hashedPassword = await bcrypt.hash("password123", 15);

  console.log("Adding admin user");
  try {
    await User.create({
      name: "Admin",
      email: "admin@email.com",
      password: hashedPassword,
      role: RolesConstant.ADMIN
    });
    console.log("Operation Completed");
  } catch (err) {
    console.log(err);
    console.log("Operation Failed");
  }
};

return seedUsersInDatabase();
