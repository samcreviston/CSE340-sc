const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory list view
 * ************************** */
invCont.buildInventoryList = async function (req, res, next) {
  try {
    const data = await invModel.getAllInventory()
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    res.render("./inventory/inventory", {
      title: "Inventory List",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
