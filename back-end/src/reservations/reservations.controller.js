/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
                              "first_name", "last_name", "mobile_number", 
                              "reservation_date", "reservation_time", "people"
                              );

// lists all reservations for a date
async function list(req, res) {

  try {  
    let {date} = req.query;
    if (!date) {
        date = new Date(Date.now()).toISOString().split('T')[0];
    }

    data = await service.list(date);
     res.json({data});
  } catch (error) {
    res.status(400).json({
      error: error
    })
  }
}

// retrieves all reservations for creating a new reservation
async function listAll(req, res){
  data = await service.listAll();
  res.json({data});
}

// creates a new reservation
async function create(req, res, next) {
  service
  .create(req.body)
  .then((data) => res.status(201).json({data}))
  .catch(next);
}

// v VALIDATORS v

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
];

function hasOnlyValidProperties(req, res, next) {

  const invalidFields = Object.keys(req.body).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    const errorMessage = `Invalid field(s): ${invalidFields
      .map((field) => `${field}`)
      .join(", ")}`;
    return next({
      status: 400,
      message: errorMessage,
    });
  }
  next();
}


// ^ VALIDATORS ^

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasOnlyValidProperties, hasRequiredProperties, asyncErrorBoundary(create)],
  listAll: [asyncErrorBoundary(listAll)]
};
