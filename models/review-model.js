const pool = require("../database/")

async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = "INSERT INTO public.review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    const data = await pool.query(sql, [review_text, inv_id, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

async function getReviewsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.review_text, r.review_date, a.account_firstname, a.account_lastname 
       FROM public.review AS r 
       JOIN public.account AS a ON r.account_id = a.account_id 
       WHERE r.inv_id = $1 
       ORDER BY r.review_date DESC`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = { addReview, getReviewsByInventoryId }