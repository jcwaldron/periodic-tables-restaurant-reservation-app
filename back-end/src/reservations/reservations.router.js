/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/new")
    .get(controller.listAll)
    .post(controller.create)
    .all(methodNotAllowed);

router
    .route("/")
    .post(controller.create)
    .get(controller.list)
    .all(methodNotAllowed);

router
    .route("/:reservation_id")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed);
  
router
    .route("/:reservation_id/status")
    .put(controller.status)
    .all(methodNotAllowed);

router
    .route("/:reservation_id/seat")
    .put(controller.update)
    .all(methodNotAllowed);

module.exports = router;
