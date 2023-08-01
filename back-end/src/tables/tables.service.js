const knex = require("../db/connection");
const tableName = "tables";

function list() {
  return knex(tableName)
    .select("*")
    .orderBy("table_name")
}

function create(table) {
    return knex(tableName)
      .insert(table, "*")
      .then((createdTables) => createdTables[0]);
  }

function read(table_id) {
  return knex(tableName).where({ table_id }).first();
}

function update({ table_id, reservation_id }) {
  return knex(tableName)
    .where({ table_id })
    .update({ reservation_id }, "*") // Update reservation_id for the specified table_id
    .then((records) => records[0]);
}

function emptyTable(table_id) {
  return knex(tableName)
  .where({table_id})
  .update({reservation_id: null});
}

function getReservationStatus({ reservation_id }) {
	return knex('reservations')
		.select('status')
		.where({ reservation_id })
		.first()		
}

function updateReservationStatus({ reservation_id, status }) {
	return knex('reservations')
		.where({ reservation_id })
		.update({ status })
}

module.exports = {
    list, create, update, read, emptyTable, updateReservationStatus, getReservationStatus
}