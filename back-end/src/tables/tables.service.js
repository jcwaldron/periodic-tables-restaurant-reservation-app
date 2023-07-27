const knex = require("../db/connection");

const tableName = "tables";

function list() {
  return knex(tableName)
    .select("*")
}

function create(table) {
    return knex(tableName)
      .insert(table, "*")
      .then((createdTables) => createdTables[0]);
  }

module.exports = {
    list, create,
}