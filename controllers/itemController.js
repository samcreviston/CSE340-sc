const itemModel = require("../models/item-model")
const utilities = require("../utilities/")

const itemCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
itemCont.buildByInvId = async function (req, res, next) {
  const item_id = req.params.InvId
  const data = await itemModel.getInventoryByInvId(inv_id)
  const grid = await utilities.buildItemDetails(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./item/item", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

 module.exports = itemCont