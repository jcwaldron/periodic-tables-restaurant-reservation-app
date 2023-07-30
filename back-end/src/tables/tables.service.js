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


module.exports = {
    list, create, update, read
}