const pool = require("../database")

/* ***************************
 *  Get a summary of all inventory items
 * ************************** */
async function getInventorySummary() {
  try {
    const data = await pool.query(
      `SELECT 
         inv_id, 
         inv_make, 
         inv_model, 
         inv_year 
       FROM public.inventory 
       ORDER BY inv_make, inv_model`
    )
    return data.rows
  } catch (error) {
    console.error("getInventorySummary error:", error)
    throw error
  }
}

module.exports = {
  getInventorySummary,
}