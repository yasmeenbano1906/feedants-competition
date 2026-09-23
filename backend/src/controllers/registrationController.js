const mongoose = require("mongoose");
const Registration = require("../models/Registration");
const Competition = require("../models/Competition");

const joinCompetition = async (req, res) => {
  const { competitionId } = req.params;
  const { userId } = req.body;

  try {
    const session = await mongoose.startSession();

    let registration;

    await session.withTransaction(async () => {
      const competition = await Competition.findOneAndUpdate(
        {
          _id: competitionId,
          startDate: { $lte: new Date() },
          endDate: { $gte: new Date() },
          $expr: {
            $lt: ["$currentParticipants", "$maxParticipants"],
          },
        },
        {
          $inc: { currentParticipants: 1 },
        },
        {
          new: true,
          session,
        }
      );

      if (!competition) {
        throw new Error("Competition is full, ended, or unavailable");
      }

      registration = await Registration.create(
        [
          {
            userId,
            competitionId,
          },
        ],
        { session }
      );
    });

    await session.endSession();

    res.status(201).json({
      success: true,
      message: "Successfully joined competition",
      data: registration[0],
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already joined this competition",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getRegistrationStatus = async (req, res) => {
  try {
    const { competitionId } = req.params;
    const { userId } = req.query;

    const registration = await Registration.findOne({
      userId,
      competitionId,
    });

    res.status(200).json({
      success: true,
      joined: !!registration,
      data: registration || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check registration status",
    });
  }
};

module.exports = {
  joinCompetition,
  getRegistrationStatus,
};