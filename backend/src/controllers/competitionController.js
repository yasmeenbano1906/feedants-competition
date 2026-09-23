const Competition = require("../models/Competition");

const getCompetitionById = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Competition not found",
      });
    }

    const now = new Date();

    let status = "upcoming";

    if (now >= competition.startDate && now <= competition.endDate) {
      status = "active";
    } else if (now > competition.endDate) {
      status = "ended";
    }

    competition.status = status;

    res.status(200).json({
      success: true,
      data: competition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get competition",
      error: error.message,
    });
  }
};

module.exports = {
  getCompetitionById,
};