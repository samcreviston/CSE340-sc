const utilities = require('../utilities')
const addClassificationModel = require('../models/add-classification-model')

/**
 * Controller to build the addClassification view
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function buildAddClassification(req, res, next) {
  try {
    const nav = await utilities.getNav()

    res.render('inventory/addClassification', {
      title: 'Add Classification',
      nav,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildAddClassification,
}
