require("dns").setServers(["8.8.8.8"]);
require("dotenv").config();

const mongoose = require("mongoose");
const Competition = require("./models/Competition");

const seedCompetition = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const competition = await Competition.create({
      title: "Feedants Coding Challenge",
      description: "Build an amazing solution and compete with other developers.",
      prize: 5000,
      maxParticipants: 100,
      currentParticipants: 0,
      startDate: new Date("2026-09-23T10:00:00"),
      endDate: new Date("2026-09-30T18:00:00"),
      status: "upcoming",
    });

    console.log("Competition created:");
    console.log(competition);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed failed:", error.message);
  }
};

seedCompetition();