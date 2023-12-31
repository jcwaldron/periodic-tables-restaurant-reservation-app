const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// v VALIDATOR FUNCTIONS v
function hasValidFields(req, res, next) {

  const { data = {} } = req.body;
  const validFields = new Set([
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
    "status",
    "created_at",
    "updated_at",
    "reservation_id"
  ]);

  const invalidFields = Object.keys(data).filter(
    field => !validFields.has(field)
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
}

function hasReservationId(req, res, next) {
  const reservation = req.params.reservation_id || req.body?.data?.reservation_id;
  if(reservation){
      res.locals.reservation_id = reservation;
      next();
  } else {
      next({
          status: 400,
          message: `missing reservation_id`,
      });
  }
}

function hasReservationIdForTable(req, res, next) {
  const reservation = req.params.reservation_id || req.params.table_id || req.body?.data?.reservation_id;
  if(reservation){
      res.locals.reservation_id = reservation;
      next();
  } else {
      next({
          status: 400,
          message: `missing reservation_id`,
      });
  }
}

async function reservationExists(req, res, next) {
  const reservation_id = res.locals.reservation_id;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({status: 404, message: `Reservation not found: ${reservation_id}`});
  }
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

function isValidDate(req, res, next) {
  const { data = {} } = req.body;
  const reservation_date = new Date(data['reservation_date']);

  // Convert the reservation_date to a date string and extract only the date part
  const dateOnly = reservation_date.toISOString().split('T')[0];

  const day = reservation_date.getUTCDay();
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:000

  if (isNaN(Date.parse(data['reservation_date']))) {
    return next({ status: 400, message: `Invalid reservation_date` });
  }
  if (day === 2) {
    return next({ status: 400, message: `Restaurant is closed on Tuesdays` });
  }

  if (dateOnly < currentDate.toISOString().split('T')[0]) {
    return next({ status: 400, message: `Reservation must be set in the future` });
  }
  next();
}


function isValidTime(req, res, next) {
	const { reservation_date, reservation_time } = req.body.data;

	const date = new Date(`${reservation_date} ${reservation_time}`);

	const dateUTC = Date.UTC(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds(),
	);

	if (
		date.getHours() < 10 ||
		(date.getHours() === 10 && date.getMinutes() < 30)
	) {
		return next({
			status: 400,
			message: "The earliest reservation time is 10:30am",
		});
	}

	if (
		date.getHours() > 21 ||
		(date.getHours() === 21 && date.getMinutes() > 30)
	) {
		return next({
			status: 400,
			message: "The latest reservation time is 9:30pm",
		});
	}
	next();
}

function isTime(req, res, next){
  const { data = {} } = req.body;

  if (/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(data['reservation_time']) || /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(data['reservation_time']) ){
    return next();
  }
  next({ status: 400, message: `Invalid reservation_time` });
}

function checkStatus(req, res, next){
  const { data = {} } = req.body;
  if (data['status'] === 'seated' || data['status'] === 'finished'){
      return next({ status: 400, message: `status is ${data['status']}` });
  }
  next();
}

function isValidNumber(req, res, next){
  const { data = {} } = req.body;
  if (data['people'] === 0 || !Number.isInteger(data['people'])){
      return next({ status: 400, message: `Invalid number of people` });
  }
  next();
}
// ^ VALIDATOR FUNCTIONS ^

// v FETCH FUNCTIONS v

async function list(req, res) {
	const { date, mobile_number } = req.query;

	if (date) {
		const data = await service.list(date);
		res.json({ data });
	} else if (mobile_number) {
		const data = await service.search(mobile_number);
		res.json({ data });
	} else {
		const data = await service.listAll();
		res.json({ data });
	}
}

// retrieves all reservations for creating a new reservation
async function listAll(req, res){
  data = await service.listAll();
  res.json({data});
}
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({
    data: data,
  });
}
async function read(req, res) {
  const data = res.locals.reservation;
  res.status(200).json({
    data,
  })
}
async function status(req, res) {
  res.locals.reservation.status = req.body.data.status;
  const data = await service.status(res.locals.reservation);
  res.json({ data });
}

async function unfinishedStatus(req, res, next) {
  if (res.locals.reservation && res.locals.reservation.status === "finished") {
    next({
      status: 400,
      message: `Reservation status: '${res.locals.reservation.status}'.`,
    });
  } else {
    next();
  }
}

async function update(req, res) {
  const { reservation_id } = res.locals.reservation;
  req.body.data.reservation_id = reservation_id;
  const data = await service.status(req.body.data);
  res.json({ data });
}

// ^ FETCH FUNCTIONS ^

// v VALIDATORS v
const has_first_name = bodyDataHas("first_name");
const has_last_name = bodyDataHas("last_name");
const has_mobile_number = bodyDataHas("mobile_number");
const has_reservation_date = bodyDataHas("reservation_date");
const has_reservation_time = bodyDataHas("reservation_time");
const has_people = bodyDataHas("people");
const has_capacity = bodyDataHas("capacity");
const has_table_name = bodyDataHas("table_name");
const has_reservation_id = bodyDataHas("reservation_id");

// ^ VALIDATORS ^

module.exports = {
  create: [
      hasValidFields,
      has_first_name,
      has_last_name,
      has_mobile_number,
      has_reservation_date,
      has_reservation_time,
      checkStatus,
      unfinishedStatus,
      has_people,
      isValidDate,
      isTime,
      isValidTime,
      isValidNumber,
      asyncErrorBoundary(create)
  ],
  read: [hasReservationId, reservationExists, asyncErrorBoundary(read)],
  list: [asyncErrorBoundary(list)],
  listAll,
  reservationExists: [hasReservationId, reservationExists],
  status: [hasReservationId, reservationExists, unfinishedStatus, asyncErrorBoundary(status)],
  update: [
      hasValidFields,
      has_first_name,
      has_last_name,
      has_mobile_number,
      has_reservation_date,
      has_reservation_time,
      has_people,
      isValidDate,
      isTime,
      isValidNumber,
      checkStatus,
      hasReservationId,
      reservationExists,
      asyncErrorBoundary(update)
  ]
};