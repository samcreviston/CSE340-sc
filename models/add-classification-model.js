const pool = require("../database")

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const data = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING classification_id
    `
    const result = await pool.query(data, [classification_name])
    return result.rowCount > 0
  } catch (error) {
    console.error("addClassification error:", error)
    throw error
  }
}

module.exports = {
  addClassification,
}