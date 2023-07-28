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

module.exports = {
    list, create,
}