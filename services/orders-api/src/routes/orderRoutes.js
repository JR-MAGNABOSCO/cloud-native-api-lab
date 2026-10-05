const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', orderController.index);
router.get('/:id', orderController.show);
router.post('/', orderController.create);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
