const knex = require("../db/connection");

// lists all reservations by date
function list(date){
    return knex("reservations")
        .select("*")
        .where("reservation_date", date)
        .orderBy("reservation_time", "asc");
}

module.exports = {
    list,
}