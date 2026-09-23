require("dns").setServers(["8.8.8.8"]);
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
    });

    console.log("User created:");
    console.log(user);

    await mongoose.disconnect();
  } catch (error) {
    console.error("User seed failed:", error.message);
  }
};

seedUser();