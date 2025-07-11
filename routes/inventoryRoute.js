const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to render add inventory form
router.get("/add-inventory", invController.buildAddInventory);

// Route to handle add inventory form submission
router.post("/add-inventory", invController.addInventory);

router.post(
  "/add-classification", invController.addClassification);

module.exports = router;
