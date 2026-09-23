const express = require("express");

const {
  getCompetitionById,
} = require("../controllers/competitionController");

const {
  joinCompetition,
  getRegistrationStatus,
} = require("../controllers/registrationController");

const router = express.Router();

router.get("/:id", getCompetitionById);

router.post("/:competitionId/join", joinCompetition);

router.get(
  "/:competitionId/registration",
  getRegistrationStatus
);

module.exports = router;