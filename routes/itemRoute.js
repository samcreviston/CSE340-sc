const express = require("express")
const router = new express.Router() 
const itemController = require("../controllers/itemController")

  // Route to build item detail page
  router.get("/detail/:invId", itemController.buildItemDetail);

module.exports = router;
