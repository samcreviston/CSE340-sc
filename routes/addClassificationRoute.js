const express = require("express")
const router = new express.Router() 
const addClassificationController = require("../controllers/addClassificationController")

  // Route to build management page
  router.get("/add-classification", addClassificationController.buildAddClassification);

module.exports = router;