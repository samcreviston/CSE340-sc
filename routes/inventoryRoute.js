const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const util = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to render add inventory form
router.get("/add-inventory", util.checkAdminEmployee, invController.buildAddInventory);

// Route to handle add inventory form submission
router.post("/add-inventory", util.checkAdminEmployee, invController.addInventory);

router.post(
  "/add-classification", util.checkAdminEmployee, invController.addClassification);

// Route to handle search requests
router.get("/search", invController.searchInventory);

module.exports = router;
