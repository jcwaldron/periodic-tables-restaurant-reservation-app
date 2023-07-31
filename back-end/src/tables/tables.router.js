const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
    .route("/new")
    .post(controller.create)
    .get(controller.list)
    .all(methodNotAllowed);

router
    .route("/:table_id/seat")
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete)    
    .all(methodNotAllowed);

router
    .route("/:table_id")
    .get(controller.read)
    .all(methodNotAllowed);

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

module.exports = router;
