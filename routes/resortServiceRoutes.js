const express = require("express");
const router = express.Router();
const controller = require("../controllers/resortServiceController");

router.get("/", controller.getAllServices);
router.post("/", controller.createService);
router.put("/:id", controller.updateService);
router.delete("/:id", controller.deleteService);

module.exports = router;
