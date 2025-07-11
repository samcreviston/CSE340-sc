const utilities = require('../utilities')
const managementModel = require('../models/management-model')

/**
 * Controller to build the inventory management view
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function buildManagement(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const inventory = await managementModel.getInventorySummary()
    //const flashMessage = req.flash("message")

    res.render('inventory/management', {
      title: 'Inventory Management',
      nav,
      //flashMessage,
      inventory,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildManagement,
}
