const express = require('express');
const router = express.Router();

// Importing data and controllers
const data = {};
data.states = require('../../model/statesData.json');
const statesController = require('../../controllers/StatesController');
const verifyState = require('../../controllers/verifyState');

// Define routes and associated handlers
router.route('/')
    .get(statesController.getAllStates);

router.route('/:state')
    .get(verifyState(), statesController.getState);

router.route('/:state/admission')
    .get(verifyState(), statesController.getAttribute);

router.route('/:state/funfact')
    .delete(verifyState(), statesController.deleteFunfact)
    .post(verifyState(), statesController.createFunfact)
    .get(verifyState(), statesController.getFunfact)
    .patch(verifyState(), statesController.updateFunfact);

router.route('/:state/nickname')
    .get(verifyState(), statesController.getAttribute);

router.route('/:state/capital')
    .get(verifyState(), statesController.getAttribute);

router.route('/:state/population')
    .get(verifyState(), statesController.getAttribute);

module.exports = router;
