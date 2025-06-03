const express = require("express")
const router = new express.Router() 
const itemController = require("../controllers/itemController")

// Route to build inventory by classification view
router.get("/type/:invId", itemController.buildByClassificationId);

module.exports = router;