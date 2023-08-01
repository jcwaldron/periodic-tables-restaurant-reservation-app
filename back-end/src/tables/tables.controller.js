const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service")
const {reservationExists} = require("../reservations/reservations.controller")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsController = require("../reservations/reservations.controller")

// v VALIDATOR FUNCTIONS

// checks if the chosen capacity for a new table is at least 1 person
function isValidNumber(req, res, next){
    const { data = {} } = req.body;
    if (data['capacity'] === 0 || !Number.isInteger(data['capacity'])){
        return next({ status: 400, message: `capacity must be at least 1` });
    }
    next();
  }

// checks if the table name for the new table is at least 2 characters long
function isValidLength(req, res, next){
    const { data = {} } = req.body;
    if (data['table_name'].length < 2) {
        return next({ status: 400, message: `table_name must be at least 2 characters long.`})
    }
    next();
}

// checks if the table being looked up
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  try {
    const table = await service.read(table_id);
    if (table) {
      res.locals.table_id = table_id;
      return next();
    } else {
      return next({
        status: 404,
        message: `Table with id ${table_id} not found.`,
      });
    }
  } catch (error) {
    return next(error);
  }
}


// validates whether properties are included
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

// Validator function to check if the table has sufficient capacity
async function isValidCapacity(req, res, next) {
  const { data = {} } = req.body;
  const { table_id } = res.locals;
  const table = await service.read(table_id); // Read the table from the database
  const reservation = await reservationsService.read(data.reservation_id)
  const requestedCapacity = reservation.people;
  const tableCapacity = table.capacity;

  if (requestedCapacity > tableCapacity) {
    return next({
      status: 400,
      message: `Cannot update reservation. Requested number of people exceeds table capacity.`,
    });
  }

  next();
}


// Validator function to check if the table is already occupied
async function isTableOccupied(req, res, next) {
  const { table_id } = res.locals;
  const table = await service.read(table_id); // Read the table from the database

  if (table.reservation_id) {
    return next({
      status: 400,
      message: `Cannot seat reservation. The table is already occupied.`,
    });
  }

  next();
}

// a validator for when the table is already empty
async function isTableEmpty(req, res, next) {
  const { table_id } = res.locals;
  const table = await service.read(table_id); // Read the table from the database

  if (!table || !table.reservation_id) {
    return next({
      status: 400,
      message: `Table is not occupied.`,
    });
  } else {
    res.status(200).json({})
  }

  next();
}


// v FETCH FUNCTIONS v

async function list(req, res) {
     res.json({
       data: await service.list(req.query)
     });
   }

async function read(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);

  if (table) {
    res.json({ data: table });
  } else {
    next({ status: 404, message: `Table with id ${table_id} not found.` });
  }
}

async function create(req, res) {
    const data = await service.create(req.body.data);
    res.status(201).json({
        data: data,
    });
 }


async function update(req, res, next) {
	try {
		const { table_id } = res.locals;
		const { reservation_id } = req.body.data; // Get reservation_id and people from the request body
		
		const {status} = await service.getReservationStatus({ reservation_id });
		if (status === 'seated') {
			throw new Error(`reservation id ${reservation_id} has already been seated`);
		}

		const data = await service.update({ table_id, reservation_id }); // Pass both table_id and reservation_id to the service
		await service.updateReservationStatus({ reservation_id, status: 'seated' });
		
		res.status(200).json({data});
	} catch (err) {
		console.error(err);
		res.status(400).json({ error: err.message})
	}
}

async function emptyTable(req, res) {
	const { table_id } = res.locals;
	const { reservation_id } = req.body.data; // Get reservation_id and people from the request body
  console.log("*****************", table_id)
	const data = await service.emptyTable( table_id );
	await service.updateReservationStatus({ reservation_id, status: 'finished' });

  res.status(200).json({})
}

// v ADDITIONAL VALIDATORS v
 const has_table_name = bodyDataHas("table_name")
 const has_capacity = bodyDataHas("capacity")
 const has_reservation_id = bodyDataHas("reservation_id")

   module.exports = {
    list: [asyncErrorBoundary(list)], 
    create: [has_table_name, has_capacity, isValidLength, isValidNumber, asyncErrorBoundary(create)],
    update: [tableExists, has_reservation_id, reservationExists, isValidCapacity, isTableOccupied, asyncErrorBoundary(update)],
    read,
    delete: [tableExists, isTableEmpty, emptyTable]
   }