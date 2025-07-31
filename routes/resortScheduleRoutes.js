const express = require("express");
const router = express.Router();
const resortScheduleController = require("../controllers/resortScheduleController");

router.get("/", resortScheduleController.getAllSchedules);
router.get("/:id", resortScheduleController.getScheduleById);
router.post("/", resortScheduleController.createSchedule);
router.put("/:id", resortScheduleController.updateSchedule);
router.delete("/:id", resortScheduleController.deleteSchedule);

module.exports = router;
