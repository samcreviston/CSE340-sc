const pool = require("../database")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    console.log("Executing query to get account by email:", account_email)
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    console.log("Query result rows:", result.rows)
    return result.rows[0]
  } catch (error) {
    console.error("Error in getAccountByEmail:", error)
    return new Error("No matching email found")
  }
}


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    console.log("Executing query to get account by email:", account_email)
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    console.log("Query result rows:", result.rows)
    return result.rows[0]
  } catch (error) {
    console.error("Error in getAccountByEmail:", error)
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using account id
* ***************************** */
async function getAccountById(account_id) {
  try {
    const sql = 'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1'
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
    console.error("Error in getAccountById:", error)
    return null
  }
}

/* *****************************
* Update account information (firstname, lastname, email) by account_id
* ***************************** */
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4`
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    return result
  } catch (error) {
    console.error("Error in updateAccountInfo:", error)
    return null
  }
}

/* *****************************
* Update account password by account_id
* ***************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `UPDATE account SET account_password = $1 WHERE account_id = $2`
    const result = await pool.query(sql, [hashedPassword, account_id])
    return result
  } catch (error) {
    console.error("Error in updatePassword:", error)
    return null
  }
}

module.exports = { registerAccount, getAccountByEmail, getAccountById, updateAccountInfo, updatePassword }
