/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const moment = require("moment");

// validates date query
/* function validateDate(req, res, next){
  if (date) {
    return next();
  }
  next({ status: })
} */

// lists all reservations by date
async function list(req, res) {

  try {  
    let {date} = req.query;

    if (!date) {
      let dateString = new Date(Date.now()).toString();
      date = moment(dateString).format('YYYY-MM-DD');
    }

    data = await service.list(date);
     res.json({ data });
  } catch (error) {
    res.status(400).json({
      error: error
    })
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
};
