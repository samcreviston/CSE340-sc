const express = require("express")
const router = new express.Router() 
const managementController = require("../controllers/managementController")

  // Route to build management page
  router.get("", managementController.buildManagement);

module.exports = router;