const knex = require("../db/connection");

// lists all reservations by date
function list(date){
    return knex("reservations")
        .select("*")
        .where("reservation_date", date)
        .orderBy("reservation_time", "asc");
}

// full list of reservations for the purpose of creating a new one
function listAll(){
    return knex("reservations")
        .select("*")
}

// creates a new reservation
function create(reservation) {
    return knex("reservations")
      .insert(reservation)
      .returning("*")
      .then((createdRecords) => createdRecords[0]);
  }

module.exports = {
    list, create, listAll
}