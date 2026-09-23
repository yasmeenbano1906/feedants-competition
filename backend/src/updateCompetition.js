require("dns").setServers(["8.8.8.8"]);
require("dotenv").config();
const mongoose = require("mongoose");
const Competition = require("./models/Competition");

async function updateCompetition() {
  await mongoose.connect(process.env.MONGO_URI);

  await Competition.findByIdAndUpdate(
    "6ab2bb00195474e4af150ce2",
    {
      entryFee: 99,

      tags: ["Dance", "Multi-Win"],

      registrationDeadline: "2026-09-23T17:30:00.000Z",
      submissionStart: "2026-09-23T22:30:00.000Z",
      submissionEnd: "2026-09-30T18:25:00.000Z",
      resultDate: "2026-09-30T18:20:00.000Z",

      judge: {
        name: "Manju Dubey",
        profession: "Professional Kathak Dancer",
        experience: "12+ Years of Experience",
      },

      previousWinners: [
        { name: "Riya Shah", position: "1st Winner" },
        { name: "Aarav Mehta", position: "1st Winner" },
        { name: "Neha Verma", position: "2nd Winner" },
        { name: "Ishita Chopra", position: "3rd Winner" },
      ],

      rewards: [
        { position: "1st Winner", amount: 550 },
        { position: "2nd Winner", amount: 300 },
        { position: "3rd Winner", amount: 240 },
        { position: "4th Winner", amount: 200 },
        { position: "5th Winner", amount: 130 },
        { position: "6th Winner", amount: 80 },
      ],

      judgingParameters: [
        "Creativity",
        "Performance",
        "Presentation",
      ],

      rules: [
        "Participants must submit their work before the deadline.",
        "Only eligible participants can participate.",
        "Submissions must follow competition guidelines.",
      ],
    },
    { new: true }
  );

  console.log("Competition updated successfully");
  await mongoose.disconnect();
}

updateCompetition().catch((error) => {
  console.error(error);
  process.exit(1);
});