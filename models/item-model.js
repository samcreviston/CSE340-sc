const pool = require("../database/")

/* ***************************
 *  Get item details by inv_id
 * ************************** */
async function getItemById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT inv_id, inv_make, inv_model, inv_year, inv_description, inv_thumbnail, inv_price, inv_miles, inv_color 
       FROM public.inventory 
       WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getItemById error " + error)
  }
}

module.exports = { getItemById }
