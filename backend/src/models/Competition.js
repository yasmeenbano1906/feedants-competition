const mongoose = require("mongoose");

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    tags: [String],

    prize: {
      type: Number,
      required: true,
      min: 0,
    },

    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },

    currentParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    registrationDeadline: Date,
    submissionStart: Date,
    submissionEnd: Date,
    resultDate: Date,

    judge: {
      name: String,
      profession: String,
      experience: String,
    },

    previousWinners: [
      {
        name: String,
        position: String,
      },
    ],

    rewards: [
      {
        position: String,
        amount: Number,
      },
    ],

    judgingParameters: [String],

    rules: [String],

    status: {
      type: String,
      enum: ["upcoming", "active", "ended"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

competitionSchema.index({ startDate: 1, endDate: 1 });
competitionSchema.index({ status: 1 });

module.exports = mongoose.model("Competition", competitionSchema);