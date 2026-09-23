const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// A user can join a competition only once
registrationSchema.index(
  { userId: 1, competitionId: 1 },
  { unique: true }
);

// Useful for finding participants of a competition
registrationSchema.index({ competitionId: 1 });

module.exports = mongoose.model("Registration", registrationSchema);