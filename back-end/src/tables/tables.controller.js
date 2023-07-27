const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// v VALIDATOR FUNCTIONS

function isValidNumber(req, res, next){
    const { data = {} } = req.body;
    console.log(data)
    if (data['capacity'] === 0 || !Number.isInteger(data['capacity'])){
        return next({ status: 400, message: `Capacity must be at least 1` });
    }
    next();
  }

function isValidLength(req, res, next){
    const { data = {} } = req.body;
    if (data['table_name'].length < 2) {
        return next({ status: 400, message: `Table name must be at least 2 characters long.`})
    }
    next();
}

// v FETCH FUNCTIONS v

async function list(req, res) {
     res.json({
       data: await service.list(req.query)
     });
   }
   
async function create(req, res) {
    const data = await service.create(req.body.data);
    res.status(201).json({
        data: data,
    });
 }


   module.exports = {
    list: [asyncErrorBoundary(list)], 
    create: [isValidLength, isValidNumber, asyncErrorBoundary(create)],
   }