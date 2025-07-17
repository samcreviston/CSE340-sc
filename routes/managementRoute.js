const express = require("express")
const router = new express.Router() 
const managementController = require("../controllers/managementController")
const util = require("../utilities")

  // Route to build management page
  router.get("", util.checkAdminEmployee, managementController.buildManagement);

module.exports = router;
